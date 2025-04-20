#pragma once
#include <cstddef>
#include <cstdint>
#include <vector>

namespace kv {
class BloomFilter {
  std::vector<bool> bits;
  size_t m, k;

public:
  BloomFilter(size_t bitsize, size_t numHashes);
  void add(uint64_t hash);
  bool maybeContains(uint64_t hash) const;
  size_t getNumHashes() const { return k; }
  size_t size() const { return m; }

  // low level implementation to access the funcitons
  void setBit(size_t idx, bool v) { bits[idx] = v; }
  bool getBit(size_t idx) const { return bits[idx]; }
};

} // namespace kv
