#include "../include/kv/config.hpp"
#include <filesystem>
#include <fstream>
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace kv {

Config Config::load(std::string conf_path) {
  std::ifstream in(conf_path);
  json j;
  if (!in) {
    std::cerr << "Error: Could not open config file: '" << conf_path << "'\n"
              << "Current working directory: "
              << std::filesystem::current_path() << "\n";
    std::exit(EXIT_FAILURE);
  }

  // Check it's not empty
  if (in.peek() == std::ifstream::traits_type::eof()) {
    std::cerr << "Error: Config file is empty: '" << conf_path << "'\n";
    std::exit(EXIT_FAILURE);
  }
  in >> j;
  Config c;
  c.data_dir = j["data_dir"];
  c.segment_size = j["segment_size_mb"].get<size_t>() * 1024 * 1024;
  c.file_ext = j["file_extension"];

  // Add new config parameters
  c.index_ext = j.value("index_extension", ".idx");
  c.bloom_ext = j.value("bloom_extension", ".bf");
  c.bloom_bits_kb = j.value("bloom_bits_kb", 8);
  c.bloom_hashes = j.value("bloom_hashes", 4);
  c.thread_pool_sz = j.value("thread_pool_size", 4);

  std::cout << "the config is loaded with the data directory as: " << c.data_dir
            << '\n';
  return c;
}

} // namespace kv
