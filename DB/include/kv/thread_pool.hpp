#pragma once
#include <condition_variable>
#include <functional>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

namespace kv {

class ThreadPool {
  std::vector<std::thread> workers;
  std::queue<std::function<void()>> tasks;
  std::mutex mu;
  std::condition_variable cv;
  bool stop = false;

public:
  ThreadPool(size_t threads);
  ~ThreadPool();
  void enqueue(std::function<void()> job);
};

} // namespace kv
