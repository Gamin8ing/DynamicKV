#pragma once
#include "hash_func.hpp"
#include <cstddef>
#include <fmt/core.h>
#include <optional>
#include <string_view>
#include <utility>
#include <vector>

namespace kv {

template <typename Key, typename Val,
          uint64_t (*HashFunc)(std::string_view) = fnv1a>
class RobinHoodMap {
public:
  RobinHoodMap(size_t default_map_size = 53);
  ~RobinHoodMap() = default;

  bool put(const Key &key, const Val &val);
  std::optional<Val> get(const Key &key) const;
  bool erase(const Key &key);
  size_t size() const noexcept { return _map_size; }
  void print_map() const;
  std::vector<std::pair<Key, Val>> get_all() const;

private:
  struct _MapEntry {
    Key key;
    Val val;
    size_t probe_len = 0;
    bool occupied = false;
  };

  std::vector<_MapEntry> _buckets;
  size_t _map_size = 0;
  void _rehash();

  size_t _ideal_hash(std::string_view key) const {
    return (HashFunc(key) % _buckets.size());
  }
};

} // namespace kv
#include "robin_hood_map.tpp"
