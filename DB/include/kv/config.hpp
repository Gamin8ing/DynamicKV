#pragma once
#include <cstddef>
#include <string>

namespace kv {

// the main config object
struct Config {
  std::string data_dir;  // the directory where all the segments will live
  size_t segment_size;   // the size of each segments
  std::string file_ext;  // extension of the file
  std::string index_ext; // new
  std::string bloom_ext; // new
  size_t bloom_bits_kb;  // new
  size_t bloom_hashes;   // new
  size_t thread_pool_sz; // new
  static Config load(std::string conf_path);
};

} // namespace kv
