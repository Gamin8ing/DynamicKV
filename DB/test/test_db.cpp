#include "../include/kv/storage_engine.hpp"
#include <chrono>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

void insert_range(kv::StorageEngine &engine, size_t start, size_t end) {
  for (size_t i = start; i < end; ++i) {
    std::string key = "key_" + std::to_string(i);
    std::string value = "value_" + std::to_string(i);

    engine.put(key, value);
  }
}

int main() {
  const std::string data_dir = "./testdb";
  const size_t total_entries = 1'000'000;
  const size_t num_threads = 8;
  const size_t entries_per_thread = total_entries / num_threads;

  kv::StorageEngine engine(data_dir, 16 * 1024 * 1024);

  std::vector<std::thread> threads;

  auto start = std::chrono::high_resolution_clock::now();

  // Spawn threads
  for (size_t t = 0; t < num_threads; ++t) {
    size_t start_idx = t * entries_per_thread;
    size_t end_idx =
        (t == num_threads - 1) ? total_entries : start_idx + entries_per_thread;
    threads.emplace_back(insert_range, std::ref(engine), start_idx, end_idx);
  }

  // Join threads
  for (auto &th : threads) {
    th.join();
  }

  auto end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double> duration = end - start;
  std::cout << "Inserted " << total_entries << " entries in "
            << duration.count() << " seconds using " << num_threads
            << " threads." << std::endl;

  return 0;
}
