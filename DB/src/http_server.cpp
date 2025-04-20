// src/http_server.cpp
#include <crow.h>
#include <iostream>
#include <memory>
#include <nlohmann/json.hpp>
#include <string>

#include "../include/kv/config.hpp"
#include "../include/kv/models/product_model.hpp"
#include "../include/kv/models/user_model.hpp"
#include "../include/kv/search_index.hpp"
#include "../include/kv/storage_engine.hpp"

using json = nlohmann::json;

int main() {
  // Load configuration
  kv::Config config = kv::Config::load("./src/config/db.conf");

  // Initialize storage engine
  std::shared_ptr<kv::StorageEngine> storage =
      std::make_shared<kv::StorageEngine>(config.data_dir, config.segment_size);

  // Initialize models
  kv::models::UserModel users(*storage);
  kv::models::ProductModel products(*storage);

  // Initialize search index
  kv::SearchIndex searchIndex(*storage);

  // Create Crow application
  crow::SimpleApp app;

  // Define API endpoints
  CROW_ROUTE(app, "/")
  ([]() { return "Welcome to DynamicKV!"; });

  // Users API

  // Get all users
  CROW_ROUTE(app, "/api/users")
  ([&users]() {
    auto allUsers = users.findAll();
    json response = json::array();

    for (const auto &user : allUsers) {
      json userObj = user.second;
      userObj["id"] = user.first;
      response.push_back(userObj);
    }

    return crow::response(response.dump());
  });

  // Get user by ID
  CROW_ROUTE(app, "/api/users/<string>")
  ([&users](const std::string &id) {
    auto user = users.findById(id);
    if (user) {
      json userObj = *user;
      userObj["id"] = id;
      return crow::response(userObj.dump());
    }
    return crow::response(404, "User not found");
  });

  // Create a new user
  CROW_ROUTE(app, "/api/users")
      .methods("POST"_method)([&users](const crow::request &req) {
        try {
          json request = json::parse(req.body);

          // Validate required fields
          if (!request.contains("username") || !request.contains("email") ||
              !request.contains("password")) {
            return crow::response(
                400, "Missing required fields: username, email, password");
          }

          std::string id =
              request.value("id", "user_" + std::to_string(std::time(nullptr)));
          std::string username = request["username"];
          std::string email = request["email"];
          std::string password = request["password"];

          // In a real app, you'd hash the password here
          std::string passwordHash =
              password; // This should be properly hashed!

          bool success = users.createUser(id, username, email, passwordHash);

          if (success) {
            json response = {{"id", id},
                             {"message", "User created successfully"}};
            return crow::response(201, response.dump());
          } else {
            return crow::response(500, "Failed to create user");
          }
        } catch (const std::exception &e) {
          return crow::response(400, std::string("Invalid JSON: ") + e.what());
        }
      });

  // Delete a user
  CROW_ROUTE(app, "/api/users/<string>")
      .methods("DELETE"_method)([&users](const std::string &id) {
        bool success = users.remove(id);
        if (success) {
          return crow::response(200, "User deleted successfully");
        }
        return crow::response(404, "User not found");
      });

  // Products API

  // Get all products
  CROW_ROUTE(app, "/api/products")
  ([&products]() {
    auto allProducts = products.findAll();
    json response = json::array();

    for (const auto &product : allProducts) {
      json productObj = product.second;
      productObj["id"] = product.first;
      response.push_back(productObj);
    }

    return crow::response(response.dump());
  });

  // Get product by ID
  CROW_ROUTE(app, "/api/products/<string>")
  ([&products](const std::string &id) {
    auto product = products.findById(id);
    if (product) {
      json productObj = *product;
      productObj["id"] = id;
      return crow::response(productObj.dump());
    }
    return crow::response(404, "Product not found");
  });

  // Create a new product
  CROW_ROUTE(app, "/api/products")
      .methods(
          "POST"_method)([&products, &searchIndex](const crow::request &req) {
        try {
          json request = json::parse(req.body);

          // Validate required fields
          if (!request.contains("name") || !request.contains("price") ||
              !request.contains("description")) {
            return crow::response(
                400, "Missing required fields: name, price, description");
          }

          // Generate ID if not provided
          std::string id = request.value(
              "id", "product_" + std::to_string(std::time(nullptr)));
          std::string name = request["name"];
          double price = request["price"];
          std::string description = request["description"];

          // Get categories or use default empty array
          std::vector<std::string> categories;
          if (request.contains("categories") &&
              request["categories"].is_array()) {
            for (const auto &category : request["categories"]) {
              categories.push_back(category);
            }
          }

          bool success =
              products.createProduct(id, name, price, description, categories);

          // Index the product for search
          if (success) {
            auto product = products.findById(id);
            if (product) {
              searchIndex.indexDocument(id, *product);
            }

            json response = {{"id", id},
                             {"message", "Product created successfully"}};
            return crow::response(201, response.dump());
          } else {
            return crow::response(500, "Failed to create product");
          }
        } catch (const std::exception &e) {
          return crow::response(400, std::string("Invalid JSON: ") + e.what());
        }
      });

  // Delete a product
  CROW_ROUTE(app, "/api/products/<string>")
      .methods("DELETE"_method)(
          [&products, &searchIndex](const std::string &id) {
            bool success = products.remove(id);
            if (success) {
              // Remove from search index too
              searchIndex.removeDocument(id);
              return crow::response(200, "Product deleted successfully");
            }
            return crow::response(404, "Product not found");
          });

  // Find products by price range
  CROW_ROUTE(app, "/api/products/price/<double>/<double>")
  ([&products](double min, double max) {
    auto results = products.findByPriceRange(min, max);
    json response = json::array();

    for (const auto &product : results) {
      json productObj = product.second;
      productObj["id"] = product.first;
      response.push_back(productObj);
    }

    return crow::response(response.dump());
  });

  // Search API
  CROW_ROUTE(app, "/api/search")
      .methods("GET"_method)(
          [&searchIndex, &products](const crow::request &req) {
            auto query = req.url_params.get("q");
            if (!query) {
              return crow::response(400, "Missing search query parameter 'q'");
            }

            auto results = searchIndex.search(query);
            json response = json::array();

            for (const auto &id : results) {
              auto product = products.findById(id);
              if (product) {
                json productObj = *product;
                productObj["id"] = id;
                response.push_back(productObj);
              }
            }

            return crow::response(response.dump());
          });

  // Start the server
  app.port(8080).multithreaded().run();

  return 0;
}
