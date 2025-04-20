#include "../include/kv/bloomfilter.hpp"
#include <cstddef>
#include <cstdint>

namespace kv {

BloomFilter::BloomFilter(std::size_t bitsize, size_t numhashes)
    : bits(bitsize), m(bitsize), k(numhashes) {}

void BloomFilter::add(uint64_t hash) {
  // double‑hashing: split into two 32‑bit halves
  uint64_t h1 = hash;
  uint64_t h2 = (hash >> 32) | (hash << 32);
  for (size_t i = 0; i < k; ++i) {
    size_t idx = (h1 + i * h2) % m;
    bits[idx] = true;
  }
}

bool BloomFilter::maybeContains(uint64_t hash) const {
  uint64_t h1 = hash;
  uint64_t h2 = (hash >> 32) | (hash << 32);
  // created two redundant hash functions to hash the key in k different way
  for (size_t i = 0; i < k; ++i) {
    size_t idx = (h1 + i * h2) % m;
    if (!bits[idx])
      return false;
  }
  return true;
}

} // namespace kv
