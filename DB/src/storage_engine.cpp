#include "../include/kv/storage_engine.hpp"
#include "../include/kv/hash_func.hpp"
#include "../include/kv/utils.hpp"
#include <cstddef>
#include <cstdint>
#include <filesystem>
#include <mutex>
#include <optional>
#include <shared_mutex>
#include <string>
#include <string_view>

namespace kv {

StorageEngine::StorageEngine(const std::string &dir, size_t seg_size)
    : seg_mgr(dir, seg_size), dir(dir) {}

// the put functtion implementation
void StorageEngine::put(const std::string &key, const std::string &val) {
  std::string_view k(key), v(val);
  uint64_t hash = fnv1a(k);
  // lock the that thing
  std::unique_lock lock(ind_mu);
  seg_mgr.append(hash, k, v);
}

// the get function
std::optional<std::string> StorageEngine::get(const std::string &key) {
  uint64_t hash = fnv1a(key);
  SegmentOffset off;
  {
    // scope for shared lock
    std::shared_lock lock(ind_mu);
    if (!seg_mgr.lookup(hash, off)) {
      return std::nullopt;
    }
  }

  // Build the filename for this segment
  std::string path = dir + "/segment_" + std::to_string(off.segment_id) + ".kv";

  // Open for read
  std::ifstream in(path, std::ios::binary);
  if (!in)
    return std::nullopt;

  // Seek to record start
  in.seekg(off.offset);
  if (!in)
    return std::nullopt;

  // Read recordLen, keyLen, valLen, flags, reserved
  uint32_t recordLen, keyLen, valLen;
  uint8_t flags, reserved;
  in.read(reinterpret_cast<char *>(&recordLen), sizeof(recordLen));
  in.read(reinterpret_cast<char *>(&keyLen), sizeof(keyLen));
  in.read(reinterpret_cast<char *>(&valLen), sizeof(valLen));
  in.read(reinterpret_cast<char *>(&flags), sizeof(flags));
  in.read(reinterpret_cast<char *>(&reserved), sizeof(reserved));

  // Read key and value
  std::string keyBuf(keyLen, '\0');
  std::string valBuf(valLen, '\0');
  in.read(keyBuf.data(), keyLen);
  in.read(valBuf.data(), valLen);

  // If tombstone, treat as not found
  if (flags == 0)
    return std::nullopt;

  // Optionally verify key matches
  if (keyBuf != key)
    return std::nullopt;

  // Read and verify CRC
  uint32_t storedCrc;
  in.read(reinterpret_cast<char *>(&storedCrc), sizeof(storedCrc));

  // Recompute CRC over the record payload
  in.seekg(off.offset + sizeof(recordLen));
  std::vector<uint8_t> payload(recordLen - sizeof(storedCrc));
  in.read(reinterpret_cast<char *>(payload.data()), payload.size());
  uint32_t computed = utils::crc32(payload.data(), payload.size());
  if (computed != storedCrc) {
    // data corruption!
    return std::nullopt;
  }

  return valBuf;
}

// erase function
bool StorageEngine::erase(const std::string &key) {
  uint64_t hash = fnv1a(key);
  std::unique_lock lock(ind_mu);

  SegmentOffset out;
  if (!seg_mgr.lookup(hash, out)) {
    return false;
  }

  // if found append a tombstone in place of key
  seg_mgr.append(hash, std::string_view(key), "");
  return true;
}

std::vector<std::pair<std::string, std::string>>
StorageEngine::get_all() const {
  std::vector<std::pair<std::string, std::string>> results;

  // This is inefficient as we'll read all files - in a real implementation,
  // you'd want this to be optimized with some form of index
  std::filesystem::path data_path(dir);
  for (const auto &entry : std::filesystem::directory_iterator(data_path)) {
    if (entry.path().extension() == ".kv") {
      std::ifstream file(entry.path(), std::ios::binary);

      while (file) {
        // Read record header
        uint32_t recordLen, keyLen, valLen;
        uint8_t flags, reserved;

        // Try to read record length
        if (!file.read(reinterpret_cast<char *>(&recordLen), sizeof(recordLen)))
          break;

        // Read the rest of the header
        file.read(reinterpret_cast<char *>(&keyLen), sizeof(keyLen));
        file.read(reinterpret_cast<char *>(&valLen), sizeof(valLen));
        file.read(reinterpret_cast<char *>(&flags), sizeof(flags));
        file.read(reinterpret_cast<char *>(&reserved), sizeof(reserved));

        // Read key and value
        std::string key(keyLen, '\0');
        std::string val(valLen, '\0');
        file.read(key.data(), keyLen);
        file.read(val.data(), valLen);

        // Skip CRC
        file.seekg(sizeof(uint32_t), std::ios::cur);

        // If it's not a tombstone, add to results
        if (flags != 0) {
          results.emplace_back(key, val);
        }
      }
    }
  }

  return results;
}

} // namespace kv
