
CXX      := g++
CXXFLAGS := -std=c++17 -O2 -Iinclude -pthread
LDFLAGS  := -lfmt

SRCS     := main.cpp config.cpp bloomfilter.cpp \
            segment.cpp segment_mgr.cpp storage_engine.cpp \
            thread_pool.cpp
OBJS     := $(SRCS:.cpp=.o)
TARGET   := dynamickv

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LDFLAGS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
