#ifndef ROBIN_HOOD_MAP_TPP
#define ROBIN_HOOD_MAP_TPP

#include "robin_hood_map.hpp"
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <fmt/format.h>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace kv {

// ============================ UTILITY/HELPER FUNCTIONS =======================

// another helper func to get the next prime number ahead of n
inline size_t next_size(size_t n) {
  if (n <= 2)
    return 2;
  return 2 * n + 1;
}

// constructor to init the hash map
template <typename K, typename V, uint64_t (*H)(std::string_view)>
RobinHoodMap<K, V, H>::RobinHoodMap(size_t def_size) {
  def_size = 26;
  _buckets.assign(def_size, _MapEntry{});
  _map_size = 0;
}

// utility func to print the hash map
template <typename K, typename V, uint64_t (*H)(std::string_view)>
void RobinHoodMap<K, V, H>::print_map() const {
  std::cout << "------------------------\nHash Map" << '\n';
  std::cout << "No of elements: " << _map_size
            << " | Bucket size: " << _buckets.size() << '\n';
  for (auto &x : _buckets) {
    if (x.occupied) {
      std::cout << fmt::format(std::to_string(x.key)) << ": "
                << fmt::format(std::to_string(x.val))
                << ", prob: " << x.probe_len << '\n';
    } else {
      std::cout << "empty!" << '\n';
    }
  }
  std::cout << "------------------------" << '\n';
}

// a function to return all the elements in the map
template <typename K, typename V, uint64_t (*H)(std::string_view)>
std::vector<std::pair<K, V>> RobinHoodMap<K, V, H>::get_all() const {
  std::vector<std::pair<K, V>> items;
  for (auto x : _buckets) {
    if (x.occupied) {
      items.push_back({x.key, x.val});
    }
  }
  return items;
}

// ============================ MAIN FUNCTIONS =================================

// put function to insert Val into the hash map
template <typename Key, typename Val, uint64_t (*Hashfunc)(std::string_view)>
bool RobinHoodMap<Key, Val, Hashfunc>::put(const Key &key, const Val &val) {
  // if load factor > 0.7 then rehash
  if ((static_cast<double>(_map_size + 1) / _buckets.size()) > 0.7) {
    // std::cout << "rehashig" << '\n';
    _rehash();
  }

  // the hash of the key
  size_t ind = _ideal_hash(std::to_string(key));
  size_t curr_probe_len = 0;
  _MapEntry to_insert = _MapEntry{key, val, 0, true};

  // iterate all the entries
  while (true) {
    _MapEntry &e = _buckets[ind];
    if (e.key == key) {
      // updating current key and value
      e.val = val;
      return true;
    } else if (e.occupied == false) {
      // we found the first empty entry
      std::swap(e, to_insert);
      // std::cout << "called" << '\n';
      _map_size++; // inc the map size, now shall we
      return true;
    } else if (e.probe_len < curr_probe_len) {
      // we found the entry which have probe len smaller than curr_probe_len
      std::swap(e, to_insert);
      std::swap(curr_probe_len, to_insert.probe_len);
    }
    ind = (ind + 1) % _buckets.size();
    curr_probe_len++;
    to_insert.probe_len = curr_probe_len;
  }

  return false;
}

// get function in the hash map
template <typename K, typename V, uint64_t (*H)(std::string_view)>
std::optional<V> RobinHoodMap<K, V, H>::get(const K &key) const {
  size_t ind = _ideal_hash(std::to_string(key));
  size_t curr_probe_dist = 0;

  // iterating in the _buckets
  while (true) {
    const _MapEntry &curr = _buckets[ind];
    if (curr.key == key) {
      // found the key in the hash map
      return curr.val;
    } else if (curr.occupied == false || curr_probe_dist > curr.probe_len) {
      // not found the key instead the first empty space
      // or the curr prob distance greateer than the curr probe length
      return std::nullopt;
    }
    ind = (ind + 1) % _buckets.size();
    curr_probe_dist++;
  }
  return std::nullopt;
}

// the function to delete a certain key from the hashmap
// we will also implement backward shift deletion instead of tombstone
template <typename K, typename V, uint64_t (*H)(std::string_view)>
bool RobinHoodMap<K, V, H>::erase(const K &key) {
  size_t ind = _ideal_hash(std::to_string(key));
  size_t curr_probe_dist = 0;

  while (true) {
    _MapEntry &curr = _buckets[ind];
    if (curr.key == key) {
      // found the key in the hash map
      break;
    } else if (curr.occupied == false || curr_probe_dist > curr.probe_len) {
      // not found the key instead the first empty space
      // or the curr prob distance greateer than the curr probe length meaning
      // theere is someone else
      return false;
    }
    ind = (ind + 1) % _buckets.size();
    curr_probe_dist++;
  }

  // backward shift deletion
  size_t next = (ind + 1) % _buckets.size();
  while (_buckets[next].occupied && _buckets[next].probe_len > 0) {
    _buckets[ind] = _buckets[next];
    --_buckets[ind].probe_len;
    ind = next;
    next = (next + 1) % _buckets.size();
  }
  _buckets[ind] = _MapEntry{};
  --_map_size;
  return true;
}

// rehash function to rehash everything with new size
template <typename K, typename V, uint64_t (*H)(std::string_view)>
void RobinHoodMap<K, V, H>::_rehash() {
  size_t new_bucket_size = next_size((size_t)_buckets.size());
  std::vector<_MapEntry> old_buckets = std::move(_buckets);
  _buckets.assign(new_bucket_size, _MapEntry{});
  _map_size = 0;
  for (auto &x : old_buckets) {
    if (x.occupied) {
      put(x.key, x.val);
    }
  }
}

} // namespace kv

#endif // !ROBIN_HOOD_MAP_TPP
