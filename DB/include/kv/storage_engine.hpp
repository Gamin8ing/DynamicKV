#pragma once
#include "segment_manager.hpp"
#include <cstddef>
#include <optional>
#include <shared_mutex>
#include <string>
#include <utility>
#include <vector>

namespace kv {

class StorageEngine {
  SegmentMgr seg_mgr;
  std::string dir; // where the files are at
  std::shared_mutex ind_mu;

public:
  StorageEngine(const std::string &dir, size_t seg_size);
  void put(const std::string &key, const std::string &val);
  std::optional<std::string> get(const std::string &key);
  bool erase(const std::string &key);
  std::vector<std::pair<std::string, std::string>> get_all() const;
};

} // namespace kv
