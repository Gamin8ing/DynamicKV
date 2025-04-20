cmake_minimum_required(VERSION 3.14)
project(DynamicKV)

set(CMAKE_CXX_STANDARD 17)
find_package(fmt REQUIRED)
find_package(Threads REQUIRED)

# Add Crow as dependency (preferably with FetchContent)
include(FetchContent)
FetchContent_Declare(
    crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow
    GIT_TAG v1.0
)
FetchContent_MakeAvailable(crow)

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

# HTTP Server executable
add_executable(dynkv_http_server http_server.cpp)
target_link_libraries(dynkv_http_server PRIVATE 
    dynkvlibs 
    crow::crow
    Threads::Threads
)

enable_testing()
add_subdirectory(../test ${CMAKE_BINARY_DIR}/test)
