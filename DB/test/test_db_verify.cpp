#include "../include/kv/storage_engine.hpp"
#include <chrono>
#include <iostream>
#include <string>

int main() {
  const std::string data_dir = "./testdb";
  const size_t num_entries = 2000000;

  // Re-open the storage engine
  kv::StorageEngine engine(data_dir, 64 * 1024 * 1024);

  std::cout << "Starting verification for " << num_entries << " entries..."
            << std::endl;

  auto start = std::chrono::high_resolution_clock::now();

  // Check all values
  for (size_t i = 0; i < num_entries; ++i) {
    std::string key = "key_" + std::to_string(i);
    auto val = engine.get(key);
    if (!val.has_value()) {
      std::cerr << "Missing value for key: " << key << std::endl;
      return 1;
    }

    std::string expected = "value_" + std::to_string(i);
    if (val.value() != expected) {
      std::cerr << "Incorrect value for key: " << key
                << ", expected: " << expected << ", got: " << val.value()
                << std::endl;
      return 1;
    }
  }

  auto end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double> duration = end - start;

  std::cout << "All values verified successfully in " << duration.count()
            << " seconds." << std::endl;

  return 0;
}
