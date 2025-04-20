#include "../include/kv/config.hpp"
#include "../include/kv/storage_engine.hpp"
#include <iostream>

int main(int argc, char **argv) {
  auto cfg = kv::Config::load("./config/db.conf");
  kv::StorageEngine engine(cfg.data_dir, cfg.segment_size);
  // engine.put("Hello", "world");
  // engine.put("general", "kenobi");
  // engine.put("apple", "is a fruit");

  auto v = engine.get("apple");
  if (v.has_value()) {
    std::cout << "apple: " << v.value() << '\n';
  } else {
    std::cout << "apple not ofund " << '\n';
  }
  // engine.erase("apple");
  auto c = engine.get("general");
  if (!c.has_value()) {
    std::cout << "apple deleted\n";
  } else {
    std::cout << "general: " << c.value() << '\n';
  }

  return 0;
}
