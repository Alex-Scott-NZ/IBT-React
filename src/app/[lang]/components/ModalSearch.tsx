// src\app\[lang]\components\ModalSearch.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  X,
  Book,
  Folder,
  FileArchive,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface SearchHit {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  uri: string;
  content?: string;
  pdfContent?: string; // Add PDF content field
  contentForSearch?: string; // Add combined content field
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
    pdfContent?: string; // Add formatted PDF content
    contentForSearch?: string; // Add formatted combined content
  };
}

interface SearchResponse {
  hits: SearchHit[];
  estimatedTotalHits: number;
  processingTimeMs: number;
}

const ModalSearch: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const currentLang = (params?.lang as string) || 'en';

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 20;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const searchHost =
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ||
    'https://headless.saggitari.us/search-api';
  const searchKey =
    process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY ||
    'd7d3be8f7e614fff7cdadb3041791b86a7c8f64e928531a2157ea943d7382442';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  // Cache for recent searches
  const searchCache = useRef<Map<string, SearchResponse>>(new Map());

  // Helper function to get scrollbar width
  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);
    return scrollbarWidth;
  };

  // Handle client-side mounting and OS detection
  useEffect(() => {
    setMounted(true);
    // Detect if user is on Mac
    if (typeof navigator !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }

      // Tab trap
      if (e.key === 'Tab') {
        const focusableElements =
          modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || [];
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  const openModal = () => {
    setIsOpen(true);
    if (typeof document !== 'undefined') {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentPage(1); // Reset page when closing
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    triggerRef.current?.focus();
  };

  // Perform search
  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      // Create cache key with page number
      const cacheKey = `${query}-page${page}`;
      const cached = searchCache.current.get(cacheKey);
      if (cached) {
        setResults(cached.hits);
        setTotalHits(cached.estimatedTotalHits);
        return;
      }

      setLoading(true);

      try {
        const offset = (page - 1) * resultsPerPage;
        const response = await fetch(`${searchHost}/indexes/articles/search`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${searchKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: query,
            limit: resultsPerPage,
            offset: offset,
            filter: `language = "${currentLang}"`,
            attributesToHighlight: [
              'title',
              'subtitle',
              'content',
              'pdfContent',
              'contentForSearch',
            ], // Add PDF fields
            attributesToCrop: ['content', 'pdfContent', 'contentForSearch'], // Crop PDF content too
            cropLength: 150,
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
            hybrid: {
              semanticRatio: 0.5,
              embedder: 'default',
            },
          }),
        });

        const data: SearchResponse = await response.json();

        // Cache the results
        searchCache.current.set(cacheKey, data);

        setResults(data.hits || []);
        setTotalHits(data.estimatedTotalHits || 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchHost, searchKey, currentLang, resultsPerPage]
  );

  // Debounced search - reset to page 1 when query changes
  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
      performSearch(searchQuery, 1);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]); // Added performSearch

  // Search when page changes
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, currentPage);
    }
  }, [currentPage, performSearch, searchQuery]); // Added searchQuery

  // Helper functions
  const renderHighlighted = (text: string | undefined) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const getArticleUrl = (uri: string) => `${baseUrl}${uri}`;

  const handleResultClick = (uri: string) => {
    closeModal();
    window.location.href = getArticleUrl(uri);
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalHits / resultsPerPage);
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalHits);

  // Custom badge components
  const MediaBadge = ({
    type,
    children,
  }: {
    type: 'pdf' | 'video' | 'audio';
    children: React.ReactNode;
  }) => {
    const bgColor =
      type === 'pdf'
        ? 'bg-communist-red'
        : type === 'video'
          ? 'bg-purple-700'
          : 'bg-green-700';
    return (
      <div
        className={`inline-flex items-center justify-center ${bgColor} text-white rounded px-1.5 py-0.5`}
      >
        <span className="font-bold text-[10px] uppercase">{children}</span>
      </div>
    );
  };

  return (
    <>
      {/* Search button using MUI to match LanguageSwitcher */}
      <Button
        ref={triggerRef}
        onClick={openModal}
        startIcon={<SearchIcon />}
        size="small"
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          fontSize: '0.875rem',
          py: 1,
          px: 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '& .MuiButton-endIcon': {
            ml: 1,
          },
        }}
        endIcon={
          mounted && (
            <kbd className="px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded border border-gray-300 font-mono">
              {isMac ? '⌘' : 'Ctrl'}+K
            </kbd>
          )
        }
      >
        Search
      </Button>

      {/* Modal - only render on client and when open */}
      {mounted && isOpen && (
        <div className="fixed inset-0 z-[60] font-helvetica">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="flex items-start justify-center min-h-screen p-4 pt-[10vh]">
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-dialog-title"
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Header with custom-bg color */}
              <div className="flex items-center p-4 bg-custom-bg">
                <SearchIcon className="text-communist-red mr-3" />
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    id="search-dialog-title"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, books, journals..."
                    className="w-full text-lg outline-none placeholder-gray-600 bg-white text-gray-900 font-helvetica pl-3 pr-10 py-2 rounded border border-gray-300"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Clear search"
                      style={{
                        border: 'none',
                        outline: 'none',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                      }}
                    >
                      <X size={14} className="text-communist-red" />
                    </button>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="ml-3 p-1.5 hover:bg-white/50 rounded transition-colors"
                  aria-label="Close search"
                  style={{
                    border: 'none',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                >
                  <X size={20} className="text-communist-red" />
                </button>
              </div>

              {/* Results - Fixed height with flex layout */}
              <div className="h-[60vh] overflow-y-auto bg-white flex flex-col">
                {/* Initial loading state */}
                {loading && !totalHits && (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2
                      className="animate-spin text-communist-red"
                      size={32}
                    />
                  </div>
                )}

                {/* No results state */}
                {!loading &&
                  searchQuery.length >= 2 &&
                  results.length === 0 &&
                  !totalHits && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-gray-700 font-helvetica">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    </div>
                  )}

                {/* Query too short state */}
                {!loading &&
                  searchQuery.length > 0 &&
                  searchQuery.length < 2 && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-gray-600 font-helvetica">
                        Type at least 2 characters to search
                      </div>
                    </div>
                  )}

                {/* Results layout - shown when we have results OR when loading with existing results */}
                {(results.length > 0 || (loading && totalHits > 0)) && (
                  <div className="flex flex-col h-full">
                    {/* Results count */}
                    <div className="px-6 py-3 text-sm text-gray-600 border-b border-gray-200 flex-shrink-0">
                      {loading ? (
                        <span className="text-gray-500">Loading...</span>
                      ) : (
                        `Showing ${startResult}-${endResult} of ${totalHits} results`
                      )}
                    </div>

                    {/* Results list with flex-1 to take remaining space */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-200 relative">
                      {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <Loader2
                            className="animate-spin text-communist-red"
                            size={32}
                          />
                        </div>
                      ) : (
                        results.map((hit) => (
                          <button
                            key={hit.id}
                            onClick={() => handleResultClick(hit.uri)}
                            className="w-full px-6 py-4 hover:bg-custom-bg/30 transition-colors text-left group"
                            style={{
                              border: 'none',
                              outline: 'none',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                            }}
                          >
                            {/* Title & Subtitle */}
                            <div className="mb-2">
                              <h3 className="font-bold text-gray-900 group-hover:text-communist-red transition-colors font-helvetica">
                                {hit._formatted?.title
                                  ? renderHighlighted(hit._formatted.title)
                                  : hit.title}
                              </h3>
                              {hit.subtitle && (
                                <p className="text-gray-700 text-sm mt-1 font-helvetica">
                                  {hit._formatted?.subtitle
                                    ? renderHighlighted(hit._formatted.subtitle)
                                    : hit.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Content snippet - prioritize regular content, then PDF content */}
                            {(hit._formatted?.content ||
                              hit._formatted?.pdfContent ||
                              hit._formatted?.contentForSearch) && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 font-helvetica">
                                {hit._formatted?.content ? (
                                  renderHighlighted(hit._formatted.content)
                                ) : hit._formatted?.contentForSearch ? (
                                  renderHighlighted(
                                    hit._formatted.contentForSearch
                                  )
                                ) : hit._formatted?.pdfContent ? (
                                  <>
                                    <span className="text-xs text-gray-500 italic">
                                      [PDF]{' '}
                                    </span>
                                    {renderHighlighted(
                                      hit._formatted.pdfContent
                                    )}
                                  </>
                                ) : null}
                              </p>
                            )}

                            {/* Metadata */}
                            <div className="flex flex-col gap-2 text-xs text-gray-600 font-helvetica">
                              {/* Related content */}
                              <div className="flex flex-wrap gap-2">
                                {hit.relatedContent?.journals?.[0] && (
                                  <span className="flex items-center gap-1">
                                    <FileArchive
                                      size={12}
                                      className="text-communist-red"
                                    />
                                    <span>
                                      Appears in journal issue:{' '}
                                      {hit.relatedContent.journals[0].title ||
                                        hit.relatedContent.journals[0].slug}
                                    </span>
                                  </span>
                                )}
                                {hit.relatedContent?.books?.[0] && (
                                  <span className="flex items-center gap-1">
                                    <Book
                                      size={12}
                                      className="text-communist-red"
                                    />
                                    <span>
                                      Appears in book:{' '}
                                      {hit.relatedContent.books[0].title ||
                                        hit.relatedContent.books[0].slug}
                                    </span>
                                  </span>
                                )}
                                {hit.relatedContent?.collections?.[0] && (
                                  <span className="flex items-center gap-1">
                                    <Folder
                                      size={12}
                                      className="text-communist-red"
                                    />
                                    <span>
                                      Appears in collection:{' '}
                                      {hit.relatedContent.collections[0]
                                        .title ||
                                        hit.relatedContent.collections[0].slug}
                                    </span>
                                  </span>
                                )}
                              </div>

                              {/* Media indicators */}
                              {(hit.hasRelatedPdf ||
                                hit.hasRelatedAudio ||
                                hit.hasRelatedVideo) && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 mr-1">
                                    Contains:
                                  </span>
                                  {hit.hasRelatedPdf && (
                                    <MediaBadge type="pdf">PDF</MediaBadge>
                                  )}
                                  {hit.hasRelatedAudio && (
                                    <MediaBadge type="audio">Audio</MediaBadge>
                                  )}
                                  {hit.hasRelatedVideo && (
                                    <MediaBadge type="video">Video</MediaBadge>
                                  )}
                                </div>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Pagination - always visible when we have multiple pages */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200 flex-shrink-0">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1 || loading}
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          style={{
                            border: 'none',
                            outline: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                          }}
                        >
                          <ChevronLeft size={16} className="text-gray-600" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(7, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 7) {
                                pageNum = i + 1;
                              } else if (currentPage <= 4) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 3) {
                                pageNum = totalPages - 6 + i;
                              } else {
                                pageNum = currentPage - 3 + i;
                              }

                              if (pageNum < 1 || pageNum > totalPages)
                                return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  disabled={loading}
                                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    currentPage === pageNum
                                      ? 'bg-communist-red text-white'
                                      : 'hover:bg-gray-100 text-gray-700'
                                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                  }}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages || loading}
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          style={{
                            border: 'none',
                            outline: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                          }}
                        >
                          <ChevronRight size={16} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty search state */}
                {!loading && !searchQuery && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-700 mb-4 font-helvetica">
                        Start typing to search...
                      </p>
                      <p className="text-xs text-gray-600 font-helvetica">
                        Tip: Press{' '}
                        <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                          ESC
                        </kbd>{' '}
                        to close
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Styles for highlighting and button reset */}
          <style jsx global>{`
            mark {
              background-color: rgb(254 240 138); /* yellow-200 */
              color: inherit;
              font-weight: 600;
              padding: 0 2px;
              border-radius: 2px;
            }

            /* Reset button styles within the modal */
            [role='dialog'] button {
              border: none;
              outline: none;
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background: none;
              cursor: pointer;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ModalSearch;
