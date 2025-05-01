#include "../include/kv/config.hpp"         // Your database Config class
#include "../include/kv/storage_engine.hpp" // Your database StorageEngine class
#include <cctype>
#include <crow.h>
#include <filesystem>
#include <nlohmann/json.hpp>
#include <unordered_map>

namespace fs = std::filesystem;

// helper functions

// function to change the uppercase string to lower case
std::string to_lower(std::string data) {

  std::transform(data.begin(), data.end(), data.begin(),
                 [](unsigned char c) { return std::tolower(c); });
  return data;
}

int main() {
  // Load configuration
  kv::Config config;
  config = config.load("./config/db.conf"); // Adjust path as needed
  std::cout << "config has " << config.data_dir << '\n';

  // creating the config data dir if not existing
  std::error_code ec;
  if (!fs::exists(config.data_dir, ec) ||
      !fs::is_directory(config.data_dir, ec)) {
    // Try to create it (and any missing parent folders)
    if (fs::create_directories(config.data_dir, ec)) {
      std::cout << "Created directory: " << config.data_dir << "\n";
    } else {
      std::cerr << "Failed to create directory: " << config.data_dir << " ("
                << ec.message() << ")\n";
    }
  }

  crow::SimpleApp app;

  // Map to hold StorageEngine instances for each model
  std::unordered_map<std::string, std::unique_ptr<kv::StorageEngine>>
      model_engines;

  // Function to get or create StorageEngine for a model
  auto get_engine = [&config, &model_engines](
                        const std::string &model) -> kv::StorageEngine * {
    auto it = model_engines.find(model);
    if (it != model_engines.end()) {
      return it->second.get();
    }
    std::string model_dir = config.data_dir + "/" + model;
    if (!fs::exists(model_dir)) {
      return nullptr;
    }
    auto engine =
        std::make_unique<kv::StorageEngine>(model_dir, config.segment_size);
    auto *ptr = engine.get();
    model_engines[model] = std::move(engine);
    return ptr;
  };

  // GET / - List all models
  CROW_ROUTE(app, "/").methods("GET"_method)(
      [&config](const crow::request &req) {
        std::vector<std::string> models;
        for (const auto &entry : fs::directory_iterator(config.data_dir)) {
          if (entry.is_directory()) {
            models.push_back(entry.path().filename().string());
          }
        }
        nlohmann::json j = models;
        return crow::response(j.dump());
      });

  // POST /{model} - Create model and add data if provided
  CROW_ROUTE(app, "/<string>")
      .methods("POST"_method)([&config, &model_engines, &get_engine](
                                  const crow::request &req, std::string model) {
        std::string model_dir = config.data_dir + "/" + model;
        std::cout << model_dir << "-> this is the model dir" << '\n';
        if (!fs::exists(model_dir)) {
          fs::create_directory(model_dir);
        }
        auto engine = get_engine(model);
        if (!engine) {
          return crow::response(500, "Failed to create engine");
        }
        if (!req.body.empty()) {
          try {
            auto json = nlohmann::json::parse(req.body);
            for (const auto &[key, value] : json.items()) {
              engine->put(key, value.dump());
            }
          } catch (const std::exception &e) {
            return crow::response(400, "Invalid JSON");
          }
        }
        return crow::response(200, "OK");
      });

  // GET /{model} - Get all data in the model, or filtered by search
  CROW_ROUTE(app, "/<string>")
      .methods("GET"_method)(
          [&get_engine](const crow::request &req, std::string model) {
            auto engine = get_engine(model);
            if (!engine) {
              return crow::response(404, "Model not found");
            }
            auto all_data = engine->get_all();
            nlohmann::json result = nlohmann::json::object();
            auto search_term = req.url_params.get("search");
            if (search_term) {
              std::string lower_search = to_lower(search_term);
              for (const auto &[key, value_str] : all_data) {
                // searching in the key string
                std::string lower_key = to_lower(key);
                if (lower_key.find(lower_search) != std::string::npos) {
                  try {
                    auto value_json = nlohmann::json::parse(value_str);
                    result[key] = value_json;
                  } catch (const std::exception &e) {
                    result[key] = value_str;
                  }
                }
                // searching in the val
                std::string lower_val = to_lower(value_str);
                if (lower_val.find(lower_search) != std::string::npos) {
                  try {
                    auto value_json = nlohmann::json::parse(value_str);
                    result[key] = value_json;
                  } catch (const std::exception &e) {
                    result[key] = value_str;
                  }
                }
              }
            } else {
              for (const auto &[key, value_str] : all_data) {
                try {
                  auto value_json = nlohmann::json::parse(value_str);
                  result[key] = value_json;
                } catch (const std::exception &e) {
                  result[key] = value_str;
                }
              }
            }
            return crow::response(result.dump());
          });

  // GET /{model}/{key} - Get specific key in the model
  CROW_ROUTE(app, "/<string>/<string>")
      .methods("GET"_method)([&get_engine](const crow::request &req,
                                           std::string model, std::string key) {
        auto engine = get_engine(model);
        if (!engine) {
          return crow::response(404, "Model not found");
        }
        auto value_opt = engine->get(key);
        if (value_opt) {
          try {
            auto value_json = nlohmann::json::parse(*value_opt);
            return crow::response(value_json.dump());
          } catch (const std::exception &e) {
            return crow::response(*value_opt);
          }
        } else {
          return crow::response(404, "Key not found");
        }
      });

  // DELETE /{model} - Delete the entire model
  CROW_ROUTE(app, "/<string>")
      .methods("DELETE"_method)(
          [&config, &model_engines](const crow::request &req,
                                    std::string model) {
            std::string model_dir = config.data_dir + "/" + model;
            if (fs::exists(model_dir)) {
              model_engines.erase(model);
              fs::remove_all(model_dir);
              return crow::response(200, "Model deleted");
            } else {
              return crow::response(404, "Model not found");
            }
          });

  // DELETE /{model}/{key} - Delete specific key in the model
  CROW_ROUTE(app, "/<string>/<string>")
      .methods("DELETE"_method)([&get_engine](const crow::request &req,
                                              std::string model,
                                              std::string key) {
        auto engine = get_engine(model);
        if (!engine) {
          return crow::response(404, "Model not found");
        }
        if (engine->erase(key)) {
          return crow::response(200, "Key deleted");
        } else {
          return crow::response(404, "Key not found");
        }
      });

  // Start the app
  app.port(8008).multithreaded().run();
  return 0;
}
