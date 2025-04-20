#pragma once
#include "bloomfilter.hpp"
#include "robin_hood_map.hpp"
#include <cstddef>
#include <cstdint>
#include <fstream>
#include <string_view>

namespace kv {

struct SegmentOffset {
  size_t segment_id;
  size_t offset;
};

struct RecordHeader {
  uint32_t key_len;
  uint32_t val_len;
  uint8_t flags;
  uint8_t reserved;
  uint32_t record_len;
};

struct Record {
  char *key;
  char *val;
};

struct RecordFooter {
  char *padding;
};

class Segment {
  size_t id;
  std::string seg_file_path, ind_file_path, bf_file_path;
  RobinHoodMap<uint64_t, size_t> local_ind;
  std::fstream data;
  BloomFilter bf;

public:
  Segment(size_t id, const std::string &dir, size_t segsize);
  ~Segment();
  size_t appendRecord(uint64_t hash, std::string_view key,
                      std::string_view val);
  void loadBloom();
  void saveBloom();
  void loadIndex();
  void saveIndex();
  bool lookup(uint64_t hash, SegmentOffset &out);
};

} // namespace kv
