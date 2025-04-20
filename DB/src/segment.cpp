#include "../include/kv/segment.hpp"
#include "../include/kv/utils.hpp"
#include <cstddef>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <ios>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace kv {

Segment::Segment(size_t id, const std::string &dir, size_t seg_size)
    : id(id), seg_file_path(dir + "/segment_" + std::to_string(id) + ".kv"),
      ind_file_path(dir + "/segment_" + std::to_string(id) + ".idx"),
      bf_file_path(dir + "/segment_" + std::to_string(id) + ".bf"), local_ind(),
      bf(8 * 1024, 4) // 8KB bloom filter with 4 hashes
{
  // open (or create) data file for append + read
  data.open(seg_file_path,
            std::ios::in | std::ios::out | std::ios::app | std::ios::binary);
  if (!data.is_open()) {
    // create the file if not present
    std::ofstream create(seg_file_path, std::ios::binary);
    create.close();
    data.open(seg_file_path,
              std::ios::in | std::ios::out | std::ios::app | std::ios::binary);
  }
  // load current index map or bloom filter if present
  loadBloom();
  loadIndex();
}

Segment::~Segment() {
  saveBloom();
  saveIndex();
  data.close();
}

// for inserting the data in the segment file
size_t Segment::appendRecord(uint64_t hash, std::string_view key,
                             std::string_view val) {
  // move the file pointer to the end and note the offset
  data.seekp(0, std::ios::end);
  size_t offset = static_cast<size_t>(data.tellp());

  // preparing the record header
  RecordHeader header;
  header.key_len = static_cast<uint32_t>(key.size());
  header.val_len = static_cast<uint32_t>(val.size());
  header.flags = (val.size() == 0) ? 0 : 1; // 1 means alive, 0 means tombstone
  header.reserved = 0;                      // for future

  // compute total length after header and everything
  header.record_len = sizeof(header.key_len) + sizeof(header.val_len) +
                      sizeof(header.flags) + sizeof(header.reserved) +
                      header.key_len + header.val_len +
                      sizeof(uint32_t); // for crc32

  // write the header
  data.write(reinterpret_cast<char *>(&header.record_len),
             sizeof(header.record_len));
  data.write(reinterpret_cast<char *>(&header.key_len), sizeof(header.key_len));
  data.write(reinterpret_cast<char *>(&header.val_len), sizeof(header.val_len));
  data.write(reinterpret_cast<char *>(&header.flags), sizeof(header.flags));
  data.write(reinterpret_cast<char *>(&header.reserved),
             sizeof(header.reserved));

  // writing the data in the file
  data.write(key.data(), header.key_len);
  data.write(val.data(), header.val_len);

  // computing crc
  size_t crcStart = offset + sizeof(header.record_len);
  size_t crcLen = header.record_len - sizeof(uint32_t);
  std::vector<char> buf(crcLen);
  data.seekg(crcStart);
  data.read(buf.data(), crcLen);
  uint32_t crc = utils::crc32(reinterpret_cast<uint8_t *>(buf.data()), crcLen);

  // Write CRC
  data.write(reinterpret_cast<char *>(&crc), sizeof(crc));

  data.flush();

  // update the local index and bloom filter
  bf.add(hash);
  local_ind.put(hash, offset);

  return offset;
}

// load the bloom filter by the segment's .bf file
void Segment::loadBloom() {
  if (!std::filesystem::exists(bf_file_path))
    return;
  std::ifstream in(bf_file_path, std::ios::binary);
  size_t bitsize;
  in.read(reinterpret_cast<char *>(&bitsize), sizeof(bitsize));
  bf = BloomFilter(bitsize, bf.getNumHashes());
  std::vector<char> raw(bitsize);
  in.read(raw.data(), bitsize);
  // unpack bits
  for (size_t i = 0; i < bitsize; ++i) {
    bf.setBit(i, raw[i]);
  }
}

// saves the bloom filter by writing it to the segment's specific .bf file
void Segment::saveBloom() {
  std::ofstream out(bf_file_path, std::ios::binary);
  size_t bitsize = bf.size();
  out.write(reinterpret_cast<char *>(&bitsize), sizeof(bitsize));
  std::vector<char> raw(bitsize);
  // pack bits
  for (size_t i = 0; i < bitsize; i++) {
    raw[i] = bf.getBit(i);
  }
  out.write(raw.data(), bitsize);
}

// loads the index (.idx) file into the local index map
void Segment::loadIndex() {
  if (!std::filesystem::exists(ind_file_path))
    return;
  std::ifstream in(ind_file_path, std::ios::binary);
  uint64_t hash;
  uint64_t off;
  while (in.read(reinterpret_cast<char *>(&hash), sizeof(hash))) {
    in.read(reinterpret_cast<char *>(&off), sizeof(off));
    local_ind.put(hash, static_cast<size_t>(off));
  }
}

// saves the local index onto the .idx file
void Segment::saveIndex() {
  std::ofstream out(ind_file_path, std::ios::binary | std::ios::trunc);
  std::vector<std::pair<uint64_t, size_t>> indexList = local_ind.get_all();
  for (auto &p : indexList) {
    uint64_t hash = p.first;
    uint64_t off = p.second;
    out.write(reinterpret_cast<char *>(&hash), sizeof(hash));
    out.write(reinterpret_cast<char *>(&off), sizeof(off));
  }
}

// a yes or no function whether the key is really there or not
bool Segment::lookup(uint64_t hash, SegmentOffset &out) {
  // first a quick check in the bloom filter
  if (!bf.maybeContains(hash))
    return false;
  auto opt = local_ind.get(hash);
  if (opt.has_value()) {
    out = {id, opt.value()};
    return true;
  }
  return false;
}

} // namespace kv
