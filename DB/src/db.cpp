#include "../include/kv/config.hpp"
#include "../include/kv/models/product_model.hpp"
#include "../include/kv/models/user_model.hpp"
#include "../include/kv/search_index.hpp"
#include "../include/kv/storage_engine.hpp"
#include <cstdlib>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

int main(int argc, char *argv[]) {
  // Load configuration
  // kv::Config config = kv::Config::load("./src/config/db.conf");
  //
  // // Initialize storage engine
  // kv::StorageEngine storage(config.data_dir, config.segment_size);
  //
  // // Initialize models
  // kv::models::UserModel users(storage);
  // kv::models::ProductModel products(storage);
  //
  // // Initialize search index
  // kv::SearchIndex searchIndex(storage);

  // // Example: Create a user
  // users.createUser("user2", "subh_bsdka", "johsdasdfn@example.com",
  //                  "hashed_password123sdfaasdf");
  // users.createUser("user4", "johasdfasdfhn_doe",
  // "john@sdfasdfasdfexample.com",
  //                  "hashed_sdfasdfpassword123");
  //
  // // Example: Create products
  // products.createProduct("product6", "iPhone 16", 999.99, "Latest iPhone
  // model",
  //                        {"electronics", "smartphones", "apple"});
  // products.createProduct("product12", "Samsung Galaxy S24", 899.99,
  //                        "Latest Samsung model",
  //                        {"electronics", "smartphones", "samsung"});
  // products.createProduct("product30", "AirPods Pro iPhone", 249.99,
  //                        "Wireless Earbuds from Apple",
  //                        {"electronics", "audio", "apple"});
  //
  // // Index the products for search
  // auto allProducts = products.findAll();
  // for (const auto &product : allProducts) {
  //   searchIndex.indexDocument(product.first, product.second);
  // }
  //
  // // Example: Search for products
  // std::cout << "Search results for 'iphone':" << std::endl;
  // auto results = searchIndex.search("iphone");
  // for (const auto &id : results) {
  //   auto product = products.findById(id);
  //   if (product) {
  //     std::cout << "- " << (*product)["name"] << ": $" << (*product)["price"]
  //               << std::endl;
  //   }
  // }
  //
  // // Example: Find products in price range
  // std::cout << "\nProducts between $200 and $500:" << std::endl;
  // auto priceResults = products.findByPriceRange(200, 500);
  // for (const auto &product : priceResults) {
  //   std::cout << "- " << product.second["name"] << ": $"
  //             << product.second["price"] << std::endl;
  // }
  //
  // // Example: Get user by id
  // auto user = users.findById("user1");
  // if (user) {
  //   std::cout << "\nFound user: " << (*user)["username"] << " ("
  //             << (*user)["email"] << ")" << std::endl;
  // }
  //
  // // Example: List all users
  // std::cout << "\nAll users:" << std::endl;
  // auto allUsers = users.findAll();
  // for (const auto &user : allUsers) {
  //   std::cout << "- " << user.second["username"] << " (" <<
  //   user.second["email"]
  //             << ")" << std::endl;
  // }
  // if (products.remove("14"))
  //   std::cout << "removed 14th product" << '\n';
  // else
  //   std::cout << "failed to remove the product, sorry" << '\n';
  kv::Config config = kv::Config::load("./config/db.conf");
  kv::StorageEngine engine(config.data_dir, config.segment_size);

  // for (int i = 0; i < 9000; i++) {
  //   engine.erase(std::to_string(i + 1));
  // }

  for (int i = 0; i < 9000; i++) {
    engine.put(std::to_string(i + 1), "val is: " + std::to_string(i + 1));
  }

  auto v = engine.get(std::to_string(9500));

  if (v.has_value()) {
    std::cout << "value of " << 9500 << ": " << v.value() << '\n';
  } else {
    std::cout << "not found for 9500" << '\n';
  }

  // for (int i = 0; i < 10; i++) {
  //   auto key = std::to_string((random() % 1000) + 8500);
  //   auto v = engine.get(key);
  //
  //   if (v.has_value()) {
  //     std::cout << "value of " << key << "is: " << v.value() << '\n';
  //   } else {
  //     std::cout << "not found" << '\n';
  //   }
  // }
  auto all = engine.get_all(); // it returns a vector

  std::cout << "these are all of the things stored in the db" << '\n';
  for (auto x : all) {
    std::cout << x.first << ": " << x.second << '\n';
  }

  return 0;
}
