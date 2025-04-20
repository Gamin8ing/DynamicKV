#include "../include/kv/robin_hood_map.hpp"
#include <cstddef>
#include <cstdint>
#include <iostream>
#include <string>

int main() {
  kv::RobinHoodMap<uint64_t, size_t> m(3);
  for (int i = 0; i < 100; i++) {
    m.put(i, (i + 1));
    // auto c = m.get(std::to_string(i));
    // std::cout << "inserted " << i << " and the value is "
    //           << ((c.has_value()) ? c.value() : "empty") << '\n';
  }
  std::cout << "inserted everything" << '\n';

  // for (int i = 0; i < 100; i++) {
  //   auto c = m.get(std::to_string(i));
  //   if (c.has_value()) {
  //     std::cout << i << ": " << c.value() << '\n';
  //   } else {
  //     std::cout << i << ": " << "empty" << '\n';
  //   }
  // }
  // std::cout << "----------------------\n" << m.size() << '\n';

  m.print_map();
  for (int i = 30; i < 70; i++) {
    m.erase((i));
  }
  for (int i = 0; i < 100; i++) {
    auto c = m.get((i));
    if (c.has_value()) {
      std::cout << "nb " << i << ": " << c.value() << '\n';
    } else {
      std::cout << "nb " << i << ": " << "empty" << '\n';
    }
  }
  m.print_map();
  std::cout << "----------------------\n" << m.size() << '\n';

  return 0;
}
