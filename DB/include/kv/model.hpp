// include/kv/model.hpp
#pragma once
#include "storage_engine.hpp"
#include <nlohmann/json.hpp>
#include <optional>
#include <string>
#include <vector>

namespace kv {

// Base class for all models
class Model {
protected:
  StorageEngine &storage;
  std::string collection_prefix;

public:
  Model(StorageEngine &storage, const std::string &collection)
      : storage(storage), collection_prefix(collection + ":") {}

  // Key methods
  std::string makeKey(const std::string &id) const {
    return collection_prefix + id;
  }

  std::string extractId(const std::string &key) const {
    return key.substr(collection_prefix.size());
  }

  // Basic CRUD operations
  bool save(const std::string &id, const nlohmann::json &data) {
    storage.put(makeKey(id), data.dump());
    return true;
  }

  std::optional<nlohmann::json> findById(const std::string &id) {
    auto result = storage.get(makeKey(id));
    if (!result) {
      return std::nullopt;
    }
    return nlohmann::json::parse(*result);
  }

  bool remove(const std::string &id) { return storage.erase(makeKey(id)); }

  std::vector<std::pair<std::string, nlohmann::json>> findAll() {
    std::vector<std::pair<std::string, nlohmann::json>> results;
    auto all_pairs = storage.get_all();

    for (const auto &pair : all_pairs) {
      // Only process keys from this collection
      if (pair.first.find(collection_prefix) == 0) {
        std::string id = extractId(pair.first);
        nlohmann::json data = nlohmann::json::parse(pair.second);
        results.emplace_back(id, data);
      }
    }

    return results;
  }
};

} // namespace kv
