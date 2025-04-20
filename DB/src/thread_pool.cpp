#include "../include/kv/thread_pool.hpp"

namespace kv {

ThreadPool::ThreadPool(size_t threads) {
  for (size_t i = 0; i < threads; ++i) {
    workers.emplace_back([this] {
      while (true) {
        std::function<void()> job;
        {
          std::unique_lock lock(mu);
          cv.wait(lock, [&] { return stop || !tasks.empty(); });
          if (stop && tasks.empty())
            return;
          job = std::move(tasks.front());
          tasks.pop();
        }
        job();
      }
    });
  }
}

ThreadPool::~ThreadPool() {
  {
    std::unique_lock lock(mu);
    stop = true;
  }
  cv.notify_all();
  for (auto &w : workers)
    w.join();
}

void ThreadPool::enqueue(std::function<void()> job) {
  {
    std::unique_lock lock(mu);
    tasks.push(std::move(job));
  }
  cv.notify_one();
}

} // namespace kv
