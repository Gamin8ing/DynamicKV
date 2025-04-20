#pragma once
#include <cstdint>
#include <string_view>

namespace kv {

// for base, we will get started with the FNV-1a non-cryptographic hahsing
// algorithm
inline uint64_t fnv1a(std::string_view s) {
  uint64_t hash = 14695981039346656037ull;
  for (auto c : s) {
    hash = hash ^ static_cast<uint64_t>(c);
    hash = hash * 1099511628211ull;
  }
  return hash;
}
} // namespace kv
