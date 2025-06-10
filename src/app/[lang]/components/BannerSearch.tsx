// src/app/[lang]/components/BannerSearch.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, FileText, Volume2, Video, Book, Folder, FileArchive, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface SearchHit {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  uri: string;
  content?: string;
  hasRelatedPdf: boolean;
  hasRelatedAudio: boolean;
  hasRelatedVideo: boolean;
  relatedContent?: {
    books?: Array<{ slug: string; title?: string }>;
    journals?: Array<{ slug: string; title?: string }>;
    collections?: Array<{ slug: string; title?: string }>;
  };
  _formatted?: {
    title?: string;
    subtitle?: string;
    content?: string;
  };
}

interface SearchResponse {
  hits: SearchHit[];
  estimatedTotalHits: number;
  processingTimeMs: number;
}

const BannerSearch: React.FC = () => {
  const params = useParams();
  const currentLang = params?.lang as string || 'en';
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const searchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'https://headless.saggitari.us/search-api';
  const searchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || 'd7d3be8f7e614fff7cdadb3041791b86a7c8f64e928531a2157ea943d7382442';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  // Close results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setTotalHits(0);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);
    
    try {
      const response = await fetch(`${searchHost}/indexes/articles/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${searchKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          limit: 10,
          filter: `language = "${currentLang}"`,
          attributesToHighlight: ['title', 'subtitle', 'content'],
          attributesToCrop: ['content'],
          cropLength: 100,
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          // 50/50 hybrid search
          hybrid: {
            semanticRatio: 0.5,
            embedder: 'default'
          }
        })
      });

      const data: SearchResponse = await response.json();
      setResults(data.hits || []);
      setTotalHits(data.estimatedTotalHits || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchHost, searchKey, currentLang]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Helper to render highlighted text
  const renderHighlighted = (text: string | undefined) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  // Helper to get URLs
  const getArticleUrl = (uri: string) => `${baseUrl}${uri}`;
  
  const getRelatedUrl = (type: string, slug: string) => {
    const typeMap: Record<string, string> = {
      'books': 'book',
      'journals': 'journal',
      'collections': 'collection'
    };
    return `${baseUrl}/${currentLang}/${typeMap[type]}/${slug}`;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          placeholder="Search articles, books, journals..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg 
                     text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Results Dropdown - Wider than input */}
      {showResults && (
        <div className="absolute top-full right-0 mt-2 w-[600px] max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            )}

            {!loading && searchQuery && results.length === 0 && (
              <div className="text-center py-8 text-gray-500 px-4">
                No results found for "{searchQuery}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <div className="divide-y divide-gray-100">
                  {results.map((hit) => (
                    <a
                      key={hit.id}
                      href={getArticleUrl(hit.uri)}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {/* Title & Subtitle */}
                      <div className="mb-1">
                        <span className="font-medium text-gray-900">
                          {hit._formatted?.title ? renderHighlighted(hit._formatted.title) : hit.title}
                        </span>
                        {hit.subtitle && (
                          <span className="text-gray-600 ml-2">
                            — {hit._formatted?.subtitle ? renderHighlighted(hit._formatted.subtitle) : hit.subtitle}
                          </span>
                        )}
                      </div>

                      {/* Content snippet */}
                      {hit._formatted?.content && (
                        <div className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {renderHighlighted(hit._formatted.content)}
                        </div>
                      )}

                      {/* Related content & media */}
                      <div className="flex items-center justify-between text-xs">
                        {/* Related collections */}
                        <div className="flex items-center gap-4 text-gray-600">
                          {hit.relatedContent?.journals && hit.relatedContent.journals.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileArchive size={12} className="text-gray-400" />
                              <span className="text-gray-700">Journal:</span>
                              <span className="text-blue-600 hover:underline">
                                {hit.relatedContent.journals[0].title || hit.relatedContent.journals[0].slug}
                              </span>
                            </span>
                          )}
                          
                          {hit.relatedContent?.books && hit.relatedContent.books.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Book size={12} className="text-gray-400" />
                              <span className="text-gray-700">Book:</span>
                              <span className="text-blue-600 hover:underline">
                                {hit.relatedContent.books[0].title || hit.relatedContent.books[0].slug}
                              </span>
                            </span>
                          )}
                          
                          {hit.relatedContent?.collections && hit.relatedContent.collections.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Folder size={12} className="text-gray-400" />
                              <span className="text-gray-700">Collection:</span>
                              <span className="text-blue-600 hover:underline">
                                {hit.relatedContent.collections[0].title || hit.relatedContent.collections[0].slug}
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Media indicators */}
                        <div className="flex items-center gap-2">
                          {(hit.hasRelatedPdf || hit.hasRelatedAudio || hit.hasRelatedVideo) && (
                            <span className="text-gray-500 mr-1">Contains:</span>
                          )}
                          {hit.hasRelatedPdf && (
                            <span className="text-blue-600" title="PDF Available">
                              <FileText size={14} />
                            </span>
                          )}
                          {hit.hasRelatedAudio && (
                            <span className="text-green-600" title="Audio Available">
                              <Volume2 size={14} />
                            </span>
                          )}
                          {hit.hasRelatedVideo && (
                            <span className="text-purple-600" title="Video Available">
                              <Video size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Results count */}
                {totalHits > 10 && (
                  <div className="px-4 py-3 text-sm text-center text-gray-600 border-t border-gray-100 bg-gray-50">
                    Showing 10 of {totalHits} results — Press Enter to see all
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Styles for highlighting */}
      <style jsx global>{`
        mark {
          background-color: #fef3c7;
          font-weight: 500;
          padding: 0 1px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default BannerSearch;