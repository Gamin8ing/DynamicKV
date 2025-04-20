// include/kv/search_index.hpp
#pragma once
#include "storage_engine.hpp"
#include <cctype>
#include <nlohmann/json.hpp>
#include <string>
#include <unordered_set>
#include <vector>

namespace kv {

class SearchIndex {
private:
  StorageEngine &storage;
  std::string index_prefix;

  // Helper function to tokenize text into words
  std::vector<std::string> tokenize(const std::string &text) {
    std::vector<std::string> tokens;
    std::string token;

    for (char c : text) {
      if (std::isalnum(c)) {
        token += std::tolower(c);
      } else if (!token.empty()) {
        tokens.push_back(token);
        token.clear();
      }
    }

    if (!token.empty()) {
      tokens.push_back(token);
    }

    return tokens;
  }

  // Add a document to a term's posting list
  void addToTerm(const std::string &term, const std::string &docId) {
    std::string termKey = index_prefix + term;
    auto existing = storage.get(termKey);

    nlohmann::json postings;
    if (existing) {
      postings = nlohmann::json::parse(*existing);
    } else {
      postings = nlohmann::json::array();
    }

    // Check if docId is already in the postings
    bool found = false;
    for (const auto &id : postings) {
      if (id == docId) {
        found = true;
        break;
      }
    }

    if (!found) {
      postings.push_back(docId);
      storage.put(termKey, postings.dump());
    }
  }

public:
  SearchIndex(StorageEngine &storage)
      : storage(storage), index_prefix("search_index:") {}

  // Index a document with the given fields
  void indexDocument(const std::string &docId, const nlohmann::json &fields) {
    std::unordered_set<std::string> uniqueTerms;

    // Process each field
    for (auto it = fields.begin(); it != fields.end(); ++it) {
      if (it.value().is_string()) {
        std::string text = it.value();
        auto tokens = tokenize(text);

        for (const auto &token : tokens) {
          uniqueTerms.insert(token);
        }
      }
    }

    // Add document to each term's posting list
    for (const auto &term : uniqueTerms) {
      addToTerm(term, docId);
    }
  }

  // Search for documents matching all terms
  std::vector<std::string> search(const std::string &query) {
    auto queryTokens = tokenize(query);

    if (queryTokens.empty()) {
      return {};
    }

    // Get posting list for first term
    std::string firstTermKey = index_prefix + queryTokens[0];
    auto firstPosting = storage.get(firstTermKey);

    if (!firstPosting) {
      return {};
    }

    std::unordered_set<std::string> resultSet;
    nlohmann::json firstDocs = nlohmann::json::parse(*firstPosting);

    for (const auto &docId : firstDocs) {
      resultSet.insert(docId);
    }

    // Intersect with other terms
    for (size_t i = 1; i < queryTokens.size(); i++) {
      std::string termKey = index_prefix + queryTokens[i];
      auto posting = storage.get(termKey);

      if (!posting) {
        return {}; // No documents match this term
      }

      nlohmann::json docs = nlohmann::json::parse(*posting);
      std::unordered_set<std::string> termDocs;

      for (const auto &docId : docs) {
        termDocs.insert(docId);
      }

      // Keep only documents that are in both sets
      std::unordered_set<std::string> intersection;
      for (const auto &docId : resultSet) {
        if (termDocs.find(docId) != termDocs.end()) {
          intersection.insert(docId);
        }
      }

      resultSet = std::move(intersection);

      if (resultSet.empty()) {
        return {}; // No documents match all terms
      }
    }

    // Convert set to vector for return
    return std::vector<std::string>(resultSet.begin(), resultSet.end());
  }

  // Remove a document from the index
  void removeDocument(const std::string &docId) {
    // Find all terms that reference this document
    auto all_keys = storage.get_all();

    for (const auto &pair : all_keys) {
      if (pair.first.find(index_prefix) == 0) {
        nlohmann::json postings = nlohmann::json::parse(pair.second);
        nlohmann::json newPostings = nlohmann::json::array();
        bool changed = false;

        for (const auto &id : postings) {
          if (id != docId) {
            newPostings.push_back(id);
          } else {
            changed = true;
          }
        }

        if (changed) {
          if (newPostings.empty()) {
            storage.erase(pair.first);
          } else {
            storage.put(pair.first, newPostings.dump());
          }
        }
      }
    }
  }
};

} // namespace kv
