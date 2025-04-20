#include "../include/kv/segment_manager.hpp"
#include <cstddef>
#include <cstdint>
#include <filesystem>
#include <mutex>
#include <string_view>

namespace kv {
SegmentMgr::SegmentMgr(const std::string &dir, size_t seg_size)
    : max_size(seg_size), dir(dir) {
  // creating directory if that doesnt exist
  std::filesystem::create_directories(dir);
  // start with segment id = 1
  current = new Segment(next_id++, dir, seg_size);
}

// destructor to delete all the segment objects
SegmentMgr::~SegmentMgr() {
  std::cout << "deleting everything" << '\n';
  delete current;
  for (auto *s : closed) {
    delete s;
  }
}

// appending the record to the file
size_t SegmentMgr::append(uint64_t hash, std::string_view key,
                          std::string_view val) {
  std::lock_guard lock(mu);

  size_t off = current->appendRecord(hash, key, val);

  // rotate if segment is too large
  if (static_cast<size_t>(off) >= max_size) {
    closed.push_back(current);
    current = new Segment(next_id++, dir, max_size);
  }
  return off;
}

// to check if certain element is present or not
bool SegmentMgr::lookup(uint64_t hash, SegmentOffset &out) {
  // Check active segment first
  if (current->lookup(hash, out))
    return true;
  // Then check closed segments in order
  for (auto *s : closed) {
    if (s->lookup(hash, out))
      return true;
  }
  return false;
}

} // namespace kv
