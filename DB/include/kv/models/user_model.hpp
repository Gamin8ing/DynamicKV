// include/kv/models/user_model.hpp
#pragma once
#include "../model.hpp"
#include <optional>
#include <string>
#include <vector>

namespace kv {
namespace models {

class UserModel : public Model {
public:
  UserModel(StorageEngine &storage) : Model(storage, "users") {}

  // User-specific methods
  bool createUser(const std::string &id, const std::string &username,
                  const std::string &email, const std::string &passwordHash) {
    nlohmann::json user = {{"username", username},
                           {"email", email},
                           {"password_hash", passwordHash},
                           {"created_at", std::time(nullptr)}};
    return save(id, user);
  }

  std::vector<std::pair<std::string, nlohmann::json>>
  findByUsername(const std::string &username) {
    std::vector<std::pair<std::string, nlohmann::json>> results;
    auto all_users = findAll();

    for (const auto &user_pair : all_users) {
      if (user_pair.second["username"] == username) {
        results.push_back(user_pair);
      }
    }

    return results;
  }
};

} // namespace models
} // namespace kv
