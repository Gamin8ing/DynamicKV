#include "../include/kv/config.hpp"
#include "../include/kv/models/product_model.hpp"
#include "../include/kv/models/user_model.hpp"
#include "../include/kv/search_index.hpp"
#include "../include/kv/storage_engine.hpp"
#include <iostream>
#include <memory>
#include <string>
#include <vector>

int main(int argc, char *argv[]) {
  // Load configuration
  kv::Config config = kv::Config::load("./src/config/db.conf");

  // Initialize storage engine
  kv::StorageEngine storage(config.data_dir, config.segment_size);

  // Initialize models
  kv::models::UserModel users(storage);
  kv::models::ProductModel products(storage);

  // Initialize search index
  kv::SearchIndex searchIndex(storage);

  // Example: Create a user
  users.createUser("user1", "john_doe", "john@example.com",
                   "hashed_password123");

  // Example: Create products
  products.createProduct("product1", "iPhone 14", 999.99, "Latest iPhone model",
                         {"electronics", "smartphones", "apple"});
  products.createProduct("product2", "Samsung Galaxy S23", 899.99,
                         "Latest Samsung model",
                         {"electronics", "smartphones", "samsung"});
  products.createProduct("product3", "AirPods Pro", 249.99,
                         "Wireless Earbuds from Apple",
                         {"electronics", "audio", "apple"});

  // Index the products for search
  auto allProducts = products.findAll();
  for (const auto &product : allProducts) {
    searchIndex.indexDocument(product.first, product.second);
  }

  // Example: Search for products
  std::cout << "Search results for 'iphone':" << std::endl;
  auto results = searchIndex.search("iphone");
  for (const auto &id : results) {
    auto product = products.findById(id);
    if (product) {
      std::cout << "- " << (*product)["name"] << ": $" << (*product)["price"]
                << std::endl;
    }
  }

  // Example: Find products in price range
  std::cout << "\nProducts between $200 and $500:" << std::endl;
  auto priceResults = products.findByPriceRange(200, 500);
  for (const auto &product : priceResults) {
    std::cout << "- " << product.second["name"] << ": $"
              << product.second["price"] << std::endl;
  }

  // Example: Get user by id
  auto user = users.findById("user1");
  if (user) {
    std::cout << "\nFound user: " << (*user)["username"] << " ("
              << (*user)["email"] << ")" << std::endl;
  }

  // Example: List all users
  std::cout << "\nAll users:" << std::endl;
  auto allUsers = users.findAll();
  for (const auto &user : allUsers) {
    std::cout << "- " << user.second["username"] << " (" << user.second["email"]
              << ")" << std::endl;
  }

  return 0;
}
