// src\app\[lang]\components\MeilisearchAdmin.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, ExternalLink, Image as ImageIcon, FileText, Volume2, Video, Book, Folder, FileArchive, RefreshCw, Calendar, ChevronDown, ChevronUp, Globe, Home, Filter, X, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface RelatedItem {
  id: string;
  title?: string;
  slug: string;
}

interface RelatedContent {
  pdfs: RelatedItem[];
  audio: RelatedItem[];
  videos: RelatedItem[];
  articles: RelatedItem[];
  books: RelatedItem[];
  collections: RelatedItem[];
  journals: RelatedItem[];
}

interface Document {
  id: string;
  databaseId: number;
  title: string;
  subtitle?: string;
  slug: string;
  uri: string;
  link: string;
  publicationDate: string;
  publicationTimestamp?: number; // Add this field
  displayDate: string;
  language: string;
  source?: string;
  places: string[];
  topics: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  hasRelatedPdf: boolean;
  hasRelatedAudio: boolean;
  hasRelatedVideo: boolean;
  relatedItemsCount: number;
  displayOnFrontPage: boolean;
  content?: string;
  fullTitle: string;
  relatedContent?: RelatedContent;
  _formatted?: {
    title?: string;
    subtitle?: string;
    content?: string;
    fullTitle?: string;
  };
}

interface IndexStats {
  numberOfDocuments: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, number>;
}

interface SearchResponse {
  hits: Document[];
  estimatedTotalHits: number;
  processingTimeMs: number;
  query: string;
}

interface RelatedContentFilter {
  type: string;
  items: Array<{ slug: string; title: string; count: number }>;
  selectedItems: string[];
}

// JSON Modal Component with proper text wrapping
const JsonModal: React.FC<{ doc: Document | null; onClose: () => void }> = ({ doc, onClose }) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">JSON Data - {doc.title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs whitespace-pre-wrap break-words">
            {JSON.stringify(doc, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

const MeilisearchAdmin: React.FC = () => {
  const params = useParams();
  const currentLang = params?.lang as string || 'en';
  
  // Add ref for results container
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [indexStats, setIndexStats] = useState<IndexStats | null>(null);
  const [showImages, setShowImages] = useState(true);
  const [showSnippets, setShowSnippets] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexStatus, setReindexStatus] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Initial filter state
  const initialFilters = {
    language: currentLang,
    displayOnFrontPage: 'true',
    dateRange: 'all',
    customDateFrom: '',
    customDateTo: ''
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [relatedContentFilters, setRelatedContentFilters] = useState<Record<string, string[]>>({});
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());

  const limit = 10;
  const searchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'https://headless.saggitari.us/search-api';
  const searchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || 'd7d3be8f7e614fff7cdadb3041791b86a7c8f64e928531a2157ea943d7382442';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  // Available languages (always show these)
  const availableLanguages = ['en', 'fr', 'es', 'de']; // Add more as needed
  
  // All possible content types (always show these)
  const allContentTypes = ['books', 'journals', 'collections', 'pdfs', 'audio', 'videos'];

  // Date formatting function - Fixed to show proper format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Reset all filters function
  const resetAllFilters = () => {
    setFilters(initialFilters);
    setRelatedContentFilters({});
    setCategoryFilters(new Set());
    setExpandedCategories(new Set());
    setShowDatePicker(false);
    setCurrentOffset(0);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentOffset(0); // Reset to first page when searching
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Scroll to top of results function
  const scrollToResults = () => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate available related content from current search results
  const availableRelatedContent = useMemo(() => {
    const contentMap: Record<string, Map<string, { title: string; count: number }>> = {
      books: new Map(),
      journals: new Map(),
      collections: new Map(),
      pdfs: new Map(),
      audio: new Map(),
      videos: new Map()
    };

    documents.forEach(doc => {
      if (doc.relatedContent) {
        // Books
        doc.relatedContent.books?.forEach(book => {
          const existing = contentMap.books.get(book.slug);
          contentMap.books.set(book.slug, {
            title: book.title || book.slug,
            count: (existing?.count || 0) + 1
          });
        });

        // Journals
        doc.relatedContent.journals?.forEach(journal => {
          const existing = contentMap.journals.get(journal.slug);
          contentMap.journals.set(journal.slug, {
            title: journal.title || journal.slug,
            count: (existing?.count || 0) + 1
          });
        });

        // Collections
        doc.relatedContent.collections?.forEach(collection => {
          const existing = contentMap.collections.get(collection.slug);
          contentMap.collections.set(collection.slug, {
            title: collection.title || collection.slug,
            count: (existing?.count || 0) + 1
          });
        });

        // PDFs
        if (doc.hasRelatedPdf && doc.relatedContent.pdfs?.length > 0) {
          doc.relatedContent.pdfs.forEach(pdf => {
            const existing = contentMap.pdfs.get(pdf.slug);
            contentMap.pdfs.set(pdf.slug, {
              title: pdf.title || 'PDF',
              count: (existing?.count || 0) + 1
            });
          });
        }

        // Audio
        if (doc.hasRelatedAudio && doc.relatedContent.audio?.length > 0) {
          doc.relatedContent.audio.forEach(audio => {
            const existing = contentMap.audio.get(audio.slug);
            contentMap.audio.set(audio.slug, {
              title: audio.title || 'Audio',
              count: (existing?.count || 0) + 1
            });
          });
        }

        // Videos
        if (doc.hasRelatedVideo && doc.relatedContent.videos?.length > 0) {
          doc.relatedContent.videos.forEach(video => {
            const existing = contentMap.videos.get(video.slug);
            contentMap.videos.set(video.slug, {
              title: video.title || 'Video',
              count: (existing?.count || 0) + 1
            });
          });
        }
      }
    });

    // Convert maps to arrays and filter out empty ones
    const result: RelatedContentFilter[] = [];
    
    Object.entries(contentMap).forEach(([type, map]) => {
      if (map.size > 0) {
        const items = Array.from(map.entries())
          .map(([slug, data]) => ({ slug, ...data }))
          .sort((a, b) => b.count - a.count);
        
        result.push({
          type,
          items,
          selectedItems: relatedContentFilters[type] || []
        });
      }
    });

    return result;
  }, [documents, relatedContentFilters]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    documents.forEach(doc => {
      if (doc.relatedContent) {
        if (doc.relatedContent.books?.length > 0) counts.books = (counts.books || 0) + 1;
        if (doc.relatedContent.journals?.length > 0) counts.journals = (counts.journals || 0) + 1;
        if (doc.relatedContent.collections?.length > 0) counts.collections = (counts.collections || 0) + 1;
        if (doc.hasRelatedPdf) counts.pdfs = (counts.pdfs || 0) + 1;
        if (doc.hasRelatedAudio) counts.audio = (counts.audio || 0) + 1;
        if (doc.hasRelatedVideo) counts.videos = (counts.videos || 0) + 1;
      }
    });
    
    return counts;
  }, [documents]);

  // Calculate language counts
  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(doc => {
      counts[doc.language] = (counts[doc.language] || 0) + 1;
    });
    return counts;
  }, [documents]);

  // Filter documents based on selected categories and specific items
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by categories first
    if (categoryFilters.size > 0) {
      filtered = filtered.filter(doc => {
        // Convert Set to Array for iteration
        for (const category of Array.from(categoryFilters)) {
          if (category === 'books' && (!doc.relatedContent?.books || doc.relatedContent.books.length === 0)) return false;
          if (category === 'journals' && (!doc.relatedContent?.journals || doc.relatedContent.journals.length === 0)) return false;
          if (category === 'collections' && (!doc.relatedContent?.collections || doc.relatedContent.collections.length === 0)) return false;
          if (category === 'pdfs' && !doc.hasRelatedPdf) return false;
          if (category === 'audio' && !doc.hasRelatedAudio) return false;
          if (category === 'videos' && !doc.hasRelatedVideo) return false;
        }
        return true;
      });
    }

    // Then filter by specific items if any
    if (Object.keys(relatedContentFilters).length > 0) {
      filtered = filtered.filter(doc => {
        for (const [type, selectedSlugs] of Object.entries(relatedContentFilters)) {
          if (selectedSlugs.length > 0 && doc.relatedContent) {
            const relatedItems = doc.relatedContent[type as keyof RelatedContent] || [];
            const hasSelectedItem = relatedItems.some(item => selectedSlugs.includes(item.slug));
            if (!hasSelectedItem) return false;
          }
        }
        return true;
      });
    }

    return filtered;
  }, [documents, categoryFilters, relatedContentFilters]);

  // Toggle category expansion
  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
        // Also clear specific item filters for this category
        setRelatedContentFilters(prev => {
          const { [category]: _, ...rest } = prev;
          return rest;
        });
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Calculate date filter - Now using numeric timestamps
  const getDateFilter = useCallback(() => {
    const now = new Date();
    let dateFilter = '';
    
    switch (filters.dateRange) {
      case 'week':
        const weekAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationTimestamp > ${weekAgo}`;
        break;
      case 'month':
        const monthAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationTimestamp > ${monthAgo}`;
        break;
      case 'year':
        const yearAgo = now.getTime() - (365 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationTimestamp > ${yearAgo}`;
        break;
      case 'custom':
        if (filters.customDateFrom) {
          const fromDate = new Date(filters.customDateFrom);
          fromDate.setHours(0, 0, 0, 0);
          dateFilter = `publicationTimestamp > ${fromDate.getTime()}`;
        }
        if (filters.customDateTo) {
          const toDate = new Date(filters.customDateTo);
          toDate.setHours(23, 59, 59, 999);
          dateFilter += dateFilter ? ` AND publicationTimestamp < ${toDate.getTime()}` : `publicationTimestamp < ${toDate.getTime()}`;
        }
        break;
    }
    
    return dateFilter;
  }, [filters.dateRange, filters.customDateFrom, filters.customDateTo]);

  // Fetch documents - wrapped in useCallback
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const filterArray: string[] = [];
      if (filters.language !== 'all') filterArray.push(`language = "${filters.language}"`);
      if (filters.displayOnFrontPage !== 'all') filterArray.push(`displayOnFrontPage = ${filters.displayOnFrontPage}`);
      
      // Add date filter (now it will work with numeric timestamps)
      const dateFilter = getDateFilter();
      if (dateFilter) filterArray.push(`(${dateFilter})`);
      
      const body: any = {
        q: debouncedSearchQuery,
        limit,
        offset: currentOffset,
        filter: filterArray.length > 0 ? filterArray.join(' AND ') : undefined,
        sort: ['publicationDate:desc']
      };

      // Add highlighting and cropping when there's a search query
      if (debouncedSearchQuery) {
        body.attributesToHighlight = ['title', 'subtitle', 'content'];
        body.attributesToCrop = ['content'];
        body.cropLength = 200;
        body.highlightPreTag = '<mark class="bg-yellow-200">';
        body.highlightPostTag = '</mark>';
      }

      // Debug logging
      console.log('Meilisearch query:', {
        query: debouncedSearchQuery,
        filters: filterArray,
        dateFilter: dateFilter,
        offset: currentOffset,
        limit: limit
      });

      const response = await fetch(`${searchHost}/indexes/articles/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${searchKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data: SearchResponse = await response.json();
      
      // Debug logging
      if (data.hits && data.hits.length > 0) {
        console.log('First result has publicationTimestamp:', data.hits[0].publicationTimestamp);
      }

      setDocuments(data.hits || []);
      setTotalHits(data.estimatedTotalHits || 0);
      setSearchTime(data.processingTimeMs || null);
      
      // Reset filters when new search is performed
      if (debouncedSearchQuery !== searchQuery) {
        setRelatedContentFilters({});
        setCategoryFilters(new Set());
        setExpandedCategories(new Set());
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false);
  }, [debouncedSearchQuery, filters, currentOffset, getDateFilter, searchHost, searchKey, limit, searchQuery]);

  // Fetch index stats - wrapped in useCallback
  const fetchIndexStats = useCallback(async () => {
    try {
      const response = await fetch(`${searchHost}/indexes/articles/stats`, {
        headers: {
          'Authorization': `Bearer ${searchKey}`
        }
      });
      const data: IndexStats = await response.json();
      setIndexStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [searchHost, searchKey]);

  // Handle reindexing
  const handleReindex = async () => {
    if (!confirm('Are you sure you want to reindex all articles? This may take a few minutes.')) {
      return;
    }

    setIsReindexing(true);
    setReindexStatus('Starting reindexing...');

    try {
      const response = await fetch('/api/index-articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${searchKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setReindexStatus(`✅ Reindexing completed! Total: ${data.total}, Indexed: ${data.indexed}`);
        
        setTimeout(() => {
          fetchIndexStats();
          fetchDocuments();
        }, 2000);
      } else {
        setReindexStatus(`❌ Reindexing failed: ${data.error}`);
      }
    } catch (error) {
      setReindexStatus('❌ Reindexing failed: Network error');
      console.error('Reindex error:', error);
    } finally {
      setIsReindexing(false);
      
      setTimeout(() => {
        setReindexStatus(null);
      }, 10000);
    }
  };

  // Handle related content filter toggle
  const toggleRelatedContentFilter = (type: string, slug: string) => {
    setRelatedContentFilters(prev => {
      const currentFilters = prev[type] || [];
      const newFilters = currentFilters.includes(slug)
        ? currentFilters.filter(s => s !== slug)
        : [...currentFilters, slug];
      
      if (newFilters.length === 0) {
        const { [type]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [type]: newFilters };
    });
  };

  // Toggle all items in a category
  const toggleAllInCategory = (type: string, items: Array<{ slug: string }>) => {
    setRelatedContentFilters(prev => {
      const currentFilters = prev[type] || [];
      const allSlugs = items.map(item => item.slug);
      const allSelected = allSlugs.every(slug => currentFilters.includes(slug));
      
      if (allSelected) {
        const { [type]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [type]: allSlugs };
      }
    });
  };

  // Handle pagination with scroll
  const handlePagination = (newOffset: number) => {
    setCurrentOffset(newOffset);
    // Small delay to ensure the new content is rendered before scrolling
    setTimeout(() => {
      scrollToResults();
    }, 100);
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters, debouncedSearchQuery, currentOffset, fetchDocuments]);

  useEffect(() => {
    fetchIndexStats();
  }, [fetchIndexStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchQuery(searchQuery); // Immediately search without waiting
    setCurrentOffset(0);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentOffset(0);
  };

  // Pagination for filtered documents
  const paginatedDocuments = filteredDocuments.slice(currentOffset, currentOffset + limit);
  const totalFilteredHits = filteredDocuments.length;
  const totalPages = Math.ceil(totalFilteredHits / limit);
  const currentPage = Math.floor(currentOffset / limit) + 1;

  // Count documents with related content
  const docsWithRelatedContent = documents.filter(d => d.relatedItemsCount > 0).length;

  // Helper functions
  const getArticleUrl = (uri: string) => {
    return `${baseUrl}${uri}`;
  };

  const getRelatedUrl = (type: string, slug: string, lang: string) => {
    const typeMap: Record<string, string> = {
      'books': 'book',
      'collections': 'collection',
      'journals': 'journal',
      'pdfs': 'pdf',
      'audio': 'audio',
      'videos': 'video',
      'articles': 'article'
    };
    return `${baseUrl}/${lang}/${typeMap[type] || type}/${slug}`;
  };

  const renderHighlightedText = (text: string | undefined) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'books': return <Book size={16} />;
      case 'journals': return <FileArchive size={16} />;
      case 'collections': return <Folder size={16} />;
      case 'pdfs': return <FileText size={16} />;
      case 'audio': return <Volume2 size={16} />;
      case 'videos': return <Video size={16} />;
      default: return null;
    }
  };

  // Check if any filters are active
  const hasActiveFilters = filters.language !== currentLang || 
                          filters.displayOnFrontPage !== 'true' || 
                          filters.dateRange !== 'all' ||
                          categoryFilters.size > 0 ||
                          Object.keys(relatedContentFilters).length > 0;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Container - All search controls */}
      <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
        {/* Title and Controls on same line */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            IBT Admin Search {indexStats && `- ${indexStats.numberOfDocuments} Articles indexed`}
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Show Options */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowImages(!showImages)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  showImages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ImageIcon size={16} />
                Images
              </button>
              <button
                onClick={() => setShowSnippets(!showSnippets)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                  showSnippets ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FileText size={16} />
                Snippets
              </button>
            </div>
            
            {/* Reindex Button */}
            <button
              onClick={handleReindex}
              disabled={isReindexing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isReindexing 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw size={20} className={isReindexing ? 'animate-spin' : ''} />
              {isReindexing ? 'Reindexing...' : 'Reindex Articles'}
            </button>
          </div>
        </div>

        {/* Reindex Status Message */}
        {reindexStatus && (
          <div className={`mb-3 p-2 rounded text-sm ${
            reindexStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
            reindexStatus.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {reindexStatus}
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search Now
            </button>
          </div>
        </form>

        {/* Search pending indicator */}
        {searchQuery !== debouncedSearchQuery && searchQuery !== '' && (
          <div className="text-sm text-blue-600 mb-2">
            Will search for &quot;{searchQuery}&quot; when you stop typing...
          </div>
        )}

        {/* Results Summary Box - Reduced height */}
        <div className="mb-3 p-3 bg-blue-100 rounded-lg">
          {loading ? (
            <div className="text-base font-semibold text-blue-900">Searching...</div>
          ) : (
            <div>
              <div className="text-base font-semibold text-blue-900">
                Found {totalHits} results
                {debouncedSearchQuery && <span> for &quot;{debouncedSearchQuery}&quot;</span>}
                {docsWithRelatedContent > 0 && <span> ({docsWithRelatedContent} with related content)</span>}
                {searchTime !== null && <span className="text-sm font-normal"> in {searchTime}ms</span>}
              </div>
              {(categoryFilters.size > 0 || Object.keys(relatedContentFilters).length > 0) && (
                <div className="text-sm text-blue-700">
                  Showing {totalFilteredHits} filtered results
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters Dropdown */}
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
          >
            <Filter size={20} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                Active
              </span>
            )}
          </button>
          
          {showFilters && (
            <div className="mt-4 space-y-4">
              {/* Standard Filters - Three columns */}
              <div className="grid grid-cols-3 gap-4">
                {/* Language Filter */}
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <Globe size={16} /> Language
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleFilterChange('language', 'all')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.language === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All
                    </button>
                    {availableLanguages.map(lang => {
                      const count = languageCounts[lang] || 0;
                      return (
                        <button
                          key={lang}
                          onClick={() => handleFilterChange('language', lang)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.language === lang ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {lang.toUpperCase()} {count > 0 && `(${count})`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <Calendar size={16} /> Date Range
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'week', 'month', 'year'].map(range => (
                      <button
                        key={range}
                        onClick={() => handleFilterChange('dateRange', range)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.dateRange === range ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {range === 'all' ? 'All Time' : 
                         range === 'week' ? 'Last Week' :
                         range === 'month' ? 'Last Month' : 'Last Year'}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        handleFilterChange('dateRange', 'custom');
                        setShowDatePicker(!showDatePicker);
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.dateRange === 'custom' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {/* Custom Date Range Picker */}
                  {showDatePicker && filters.dateRange === 'custom' && (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="date"
                        value={filters.customDateFrom}
                        onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <span className="text-sm">to</span>
                      <input
                        type="date"
                        value={filters.customDateTo}
                        onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Front Page Filter */}
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <Home size={16} /> Front Page Display
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'true', 'false'].map(value => (
                      <button
                        key={value}
                        onClick={() => handleFilterChange('displayOnFrontPage', value)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.displayOnFrontPage === value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {value === 'all' ? 'All' : value === 'true' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Content Filters - Dynamic height based on content */}
              <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Content Filters</h3>
                
                {/* Category Level Filters - Always show all types */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {allContentTypes.map(type => {
                    const count = categoryCounts[type] || 0;
                    return (
                      <button
                        key={type}
                        onClick={() => toggleCategoryFilter(type)}
                        disabled={count === 0}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                          categoryFilters.has(type)
                            ? 'bg-blue-500 text-white'
                            : count === 0 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {getIcon(type)}
                        <span className="capitalize">{type}</span>
                        <span className="font-semibold">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Filters - Only show for selected categories */}
                {availableRelatedContent.filter(({ type }) => categoryFilters.has(type)).length > 0 && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {availableRelatedContent
                      .filter(({ type }) => categoryFilters.has(type))
                      .map(({ type, items, selectedItems }) => {
                        const isExpanded = expandedCategories.has(type);
                        const allSelected = items.every(item => selectedItems.includes(item.slug));
                        
                        return (
                          <div key={type} className="border border-blue-200 rounded-lg bg-white">
                            <div className="p-3 flex items-center justify-between">
                              <button
                                onClick={() => toggleCategoryExpansion(type)}
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                <span className="flex items-center gap-1 font-medium capitalize">
                                  {getIcon(type)} {type} Details
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({items.length} unique items)
                                </span>
                              </button>
                              {isExpanded && (
                                <button
                                  onClick={() => toggleAllInCategory(type, items)}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {allSelected ? 'Deselect All' : 'Select All'}
                                </button>
                              )}
                            </div>
                            
                            {isExpanded && (
                              <div className="border-t p-3 max-h-60 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {items.map(item => (
                                    <label key={item.slug} className="flex items-start gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.slug)}
                                        onChange={() => toggleRelatedContentFilter(type, item.slug)}
                                        className="mt-0.5"
                                      />
                                      <span className="flex-1">
                                        {item.title} <span className="text-gray-500">({item.count})</span>
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <div className="flex justify-center">
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                  >
                    <RotateCcw size={18} />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Container - Separate from header */}
      <div ref={resultsContainerRef} className="bg-gray-100 rounded-lg shadow-lg p-6">
        {/* Results */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedDocuments.map((doc) => (
                <div key={doc.id} className="bg-white border border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors shadow-sm">
                  <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                      {/* Title and Subtitle */}
                      <div className="mb-3">
                        <h3 className="text-xl font-semibold mb-1">
                          <a 
                            href={getArticleUrl(doc.uri)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 inline-flex items-center gap-1"
                          >
                            {doc._formatted?.title ? renderHighlightedText(doc._formatted.title) : doc.title}
                            <ExternalLink size={16} />
                          </a>
                        </h3>
                        {doc.subtitle && (
                          <p className="text-gray-600 text-lg">
                            {doc._formatted?.subtitle ? renderHighlightedText(doc._formatted.subtitle) : doc.subtitle}
                          </p>
                        )}
                      </div>
                      
                      {/* Search Snippet */}
                      {showSnippets && debouncedSearchQuery && doc._formatted?.content && (
                        <div className="mb-3 p-3 bg-gray-100 rounded border border-gray-200 text-sm">
                          <div className="text-gray-700 italic">
                            ...{renderHighlightedText(doc._formatted.content)}...
                          </div>
                        </div>
                      )}
                      
                      {/* Metadata - Updated with formatted date */}
                      <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                        <span>ID: {doc.databaseId}</span>
                        <span>Lang: <span className="font-medium">{doc.language.toUpperCase()}</span></span>
                        <span>Date: <span className="font-medium">{formatDate(doc.publicationDate)}</span></span>
                        {doc.source && <span>Source: {doc.source}</span>}
                        {doc.displayOnFrontPage && <span className="text-green-600 font-medium">✓ Front Page</span>}
                      </div>

                      {/* Media Indicators */}
                      <div className="flex gap-3 mb-3">
                        {doc.hasRelatedPdf && <span className="text-blue-600 flex items-center gap-1 font-medium"><FileText size={16} /> PDF</span>}
                        {doc.hasRelatedAudio && <span className="text-green-600 flex items-center gap-1 font-medium"><Volume2 size={16} /> Audio</span>}
                        {doc.hasRelatedVideo && <span className="text-purple-600 flex items-center gap-1 font-medium"><Video size={16} /> Video</span>}
                      </div>

                      {/* Places & Topics */}
                      {(doc.places.length > 0 || doc.topics.length > 0) && (
                        <div className="mb-3 text-sm">
                          {doc.places.length > 0 && (
                            <div><span className="font-medium">Places:</span> {doc.places.join(', ')}</div>
                          )}
                          {doc.topics.length > 0 && (
                            <div><span className="font-medium">Topics:</span> {doc.topics.join(', ')}</div>
                          )}
                        </div>
                      )}

                      {/* Related Content - Clearly part of this result */}
                      {doc.relatedContent && doc.relatedItemsCount > 0 && (
                        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                          <div className="font-medium mb-2 text-gray-700">Related Content:</div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {doc.relatedContent.books?.length > 0 && (
                              <div>
                                <span className="flex items-center gap-1 font-medium text-gray-700"><Book size={14} /> Books:</span>
                                <div className="ml-5 space-y-1">
                                  {doc.relatedContent.books.map((book, idx) => (
                                    <a
                                      key={idx}
                                      href={getRelatedUrl('books', book.slug, doc.language)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-blue-600 hover:underline"
                                    >
                                      {book.title || book.slug}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {doc.relatedContent.collections?.length > 0 && (
                              <div>
                                <span className="flex items-center gap-1 font-medium text-gray-700"><Folder size={14} /> Collections:</span>
                                <div className="ml-5 space-y-1">
                                  {doc.relatedContent.collections.map((collection, idx) => (
                                    <a
                                      key={idx}
                                      href={getRelatedUrl('collections', collection.slug, doc.language)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-blue-600 hover:underline"
                                    >
                                      {collection.slug}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {doc.relatedContent.journals?.length > 0 && (
                              <div>
                                <span className="flex items-center gap-1 font-medium text-gray-700"><FileArchive size={14} /> Journals:</span>
                                <div className="ml-5 space-y-1">
                                  {doc.relatedContent.journals.map((journal, idx) => (
                                    <a
                                      key={idx}
                                      href={getRelatedUrl('journals', journal.slug, doc.language)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-blue-600 hover:underline"
                                    >
                                      {journal.title || journal.slug}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {doc.relatedContent.articles?.length > 0 && (
                              <div>
                                <span className="flex items-center gap-1 font-medium text-gray-700"><FileText size={14} /> Related Articles:</span>
                                <div className="ml-5 space-y-1">
                                  {doc.relatedContent.articles.map((article, idx) => (
                                    <a
                                      key={idx}
                                      href={getRelatedUrl('articles', article.slug, doc.language)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-blue-600 hover:underline"
                                    >
                                      {article.title || article.slug}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Side - Image and JSON button */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Featured Image - Only show if exists and showImages is true */}
                      {showImages && doc.featuredImage && (
                        <div className="w-48 h-36 relative">
                          <Image
                            src={doc.featuredImage}
                            alt={doc.featuredImageAlt || doc.title}
                            width={192}
                            height={144}
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* JSON View Button */}
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 font-medium"
                      >
                        <Eye size={18} />
                        View JSON
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handlePagination(Math.max(0, currentOffset - limit))}
                disabled={currentOffset === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <span className="text-gray-600">
                Page {currentPage} of {totalPages} ({totalFilteredHits} results)
              </span>
              
              <button
                onClick={() => handlePagination(currentOffset + limit)}
                disabled={currentOffset + limit >= totalFilteredHits}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* JSON Modal */}
      <JsonModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />

      {/* Add custom styles for highlighting */}
      <style jsx global>{`
        mark {
          background-color: #fef3c7;
          padding: 0 2px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default MeilisearchAdmin;