// include/kv/models/product_model.hpp
#pragma once
#include "../model.hpp"
#include <optional>
#include <string>
#include <vector>

namespace kv {
namespace models {

class ProductModel : public Model {
public:
  ProductModel(StorageEngine &storage) : Model(storage, "products") {}

  // Product-specific methods
  bool createProduct(const std::string &id, const std::string &name,
                     double price, const std::string &description,
                     const std::vector<std::string> &categories) {
    nlohmann::json product = {{"name", name},
                              {"price", price},
                              {"description", description},
                              {"categories", categories},
                              {"created_at", std::time(nullptr)}};
    return save(id, product);
  }

  std::vector<std::pair<std::string, nlohmann::json>>
  findByPriceRange(double min, double max) {
    std::vector<std::pair<std::string, nlohmann::json>> results;
    auto all_products = findAll();

    for (const auto &product_pair : all_products) {
      double price = product_pair.second["price"];
      if (price >= min && price <= max) {
        results.push_back(product_pair);
      }
    }

    return results;
  }
};

} // namespace models
} // namespace kv
