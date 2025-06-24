# DynamicKV

**A Scalable Web-Based Key-Value Store with Adaptive Consistency and Real-Time Synchronization**

DynamicKV began as our college DBMS project and evolved into a lightweight NoSQL engine with a REST API. It’s written in modern C++17, uses custom made HashMap based on Robin-Hood Hashing, and exposes data over HTTP via [Crow](https://crowcpp.org/). You can play with it as a standalone binary or integrate it into your own services.

---

## 🚀 Features

- **Model-based storage**: Store any “model” (e.g. `users`, `products`, etc.) in its own folder under `data/`.  
- **Segmented on-disk files**: Each model folder contains rolling segment files named:
  - `.kv` — append-only records  
  - `.idx` — in-disk index of key→offset pairs  
  - `.bf` — Bloom filter for fast “not present” checks  
- **Tunable segment sizing** via `config/db.conf`.  
- **In-memory cache** with Robin-Hood hashing for hot keys.  
- **Thread-safe** append, lookup, delete operations.  
- **Pure-C++ REST API** using Crow — no external DB required.  

---

## 📦 Tech Stack 

- **Core**: C++, STL, `<filesystem>`, `std::thread`/`mutex`, My own hashmap library  
- **Networking**: [Crow](https://crowcpp.org/) (header-only, Flask-style)  
- **Build & CLI**: GNU Makefile / `g++`` / `fmt` library  
- **Configuration**: JSON (`nlohmann::json`)  

---

## 🏁 Quickstart

### 1. Clone & Build

```bash
git clone https://github.com/Gamin8ing/DynamicKV.git
cd DynamicKV
make
````

This runs:

```bash
g++ -std=c++17 -O2 \
    main.cpp config.cpp bloomfilter.cpp segment.cpp segment_mgr.cpp \
    storage_engine.cpp thread_pool.cpp \
    -Iinclude -lfmt -pthread \
    -o dynamickv
```

Alternatively, download a **prebuilt binary** from the [Releases](https://github.com/Gamin8ing/DynamicKV/releases) page and unpack it.

### 2. Configure

Edit **`config/db.conf`** to your liking (default below):

```json
{
  "data_dir":        "./data",
  "segment_size_mb": 64,
  "file_extension":  ".kv",
  "index_extension": ".idx",
  "bloom_extension": ".bf",
  "bloom_bits_kb":   8,
  "bloom_hashes":    4,
  "thread_pool_size":4
}
```

* `data_dir` is where your per-model folders (`users/`, `products/`, …) live.
* Bloom filter & segment sizing come from here.

### 3. Run

```bash
./dynamickv
```

By default it listens on port `8008`.

---

## 📚 API Documentation

All endpoints use JSON. Base URL: `http://localhost:8008/`

| Method   | Path             | Body (JSON)                         | Description                                                        |
| -------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------ |
| `GET`    | `/`              | —                                   | List all models (subdirectories).                                  |
| `POST`   | `/{model}/{key}` | `{ "key": "...", ...other fields }` | Create model (if needed). If JSON, creates or updates `model/key`. |
| `GET`    | `/{model}`       | —                                   | Get all key→value pairs in `model`.                                |
| `GET`    | `/{model}/{key}` | —                                   | Get the single JSON object `model/key`.                            |
| `DELETE` | `/{model}`       | —                                   | Delete entire model and files.                                     |
| `DELETE` | `/{model}/{key}` | —                                   | Delete one key in the model.                                       |

---

## 🤝 Contributing

1. Fork & clone
2. Create a feature branch
3. Submit a PR

