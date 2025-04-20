#pragma once
#include "segment.hpp"
#include <cstddef>
#include <cstdint>
#include <mutex>
#include <string_view>
#include <vector>

namespace kv {

class SegmentMgr {
  std::vector<Segment *> closed;
  Segment *current;
  std::mutex mu;
  size_t max_size;
  std::string dir;
  size_t next_id = 1;

public:
  SegmentMgr(const std::string &dir, size_t segment_size);
  ~SegmentMgr();
  size_t append(uint64_t hash, std::string_view key, std::string_view val);
  bool lookup(uint64_t hash, SegmentOffset &out);
};

} // namespace kv
