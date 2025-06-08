// src/app/utils/meilisearch-client.ts

import { MeiliSearch } from 'meilisearch';

// Create clients lazily to ensure env vars are loaded
let _meilisearchClient: MeiliSearch | null = null;
let _searchClient: MeiliSearch | null = null;

export function getMeilisearchClient(): MeiliSearch {
  if (!_meilisearchClient) {
    if (!process.env.NEXT_PUBLIC_MEILISEARCH_HOST) {
      throw new Error('NEXT_PUBLIC_MEILISEARCH_HOST is not defined');
    }
    if (!process.env.MEILISEARCH_ADMIN_KEY) {
      throw new Error('MEILISEARCH_ADMIN_KEY is not defined');
    }
    _meilisearchClient = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_ADMIN_KEY,
    });
  }
  return _meilisearchClient;
}

export function getSearchClient(): MeiliSearch {
  if (!_searchClient) {
    if (!process.env.NEXT_PUBLIC_MEILISEARCH_HOST) {
      throw new Error('NEXT_PUBLIC_MEILISEARCH_HOST is not defined');
    }
    if (!process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY) {
      throw new Error('NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY is not defined');
    }
    _searchClient = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
      apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY,
    });
  }
  return _searchClient;
}

// Simple wrapper - only expose what we actually use
export const meilisearchClient = {
  index: (indexName: string) => getMeilisearchClient().index(indexName),
};

export const searchClient = {
  index: (indexName: string) => getSearchClient().index(indexName),
};