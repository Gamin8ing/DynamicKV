cmake_minimum_required(VERSION 3.14)
project(DynamicKV)

set(CMAKE_CXX_STANDARD 17)
find_package(fmt REQUIRED)

include_directories(../include)

add_library(dynkvlibs
    config.cpp
    bloomfilter.cpp
    segment.cpp
    segment_mgr.cpp
    storage_engine.cpp
    thread_pool.cpp
)
target_link_libraries(dynkvlibs PRIVATE fmt::fmt)

add_executable(dynkv_main main.cpp)
target_link_libraries(dynkv_main PRIVATE dynkvlibs)


enable_testing()
add_subdirectory(../test ${CMAKE_BINARY_DIR}/test)


