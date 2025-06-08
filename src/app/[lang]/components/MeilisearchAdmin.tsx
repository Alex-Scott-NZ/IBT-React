// src/app/[lang]/components/MeilisearchAdmin.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Filter, ExternalLink, Image as ImageIcon, FileText, Volume2, Video, Book, Folder, FileArchive, RefreshCw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

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

const MeilisearchAdmin: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [indexStats, setIndexStats] = useState<IndexStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [showSnippets, setShowSnippets] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexStatus, setReindexStatus] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    language: 'all',
    displayOnFrontPage: 'all',
    dateRange: 'all',
    customDateFrom: '',
    customDateTo: ''
  });
  const [relatedContentFilters, setRelatedContentFilters] = useState<Record<string, string[]>>({});
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());

  const limit = 10;
  const searchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'https://headless.saggitari.us/search-api';
  const searchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || 'd7d3be8f7e614fff7cdadb3041791b86a7c8f64e928531a2157ea943d7382442';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

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

  // Calculate date filter
  const getDateFilter = () => {
    const now = new Date();
    let dateFilter = '';
    
    switch (filters.dateRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationDate >= ${weekAgo.getTime()}`;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationDate >= ${monthAgo.getTime()}`;
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = `publicationDate >= ${yearAgo.getTime()}`;
        break;
      case 'custom':
        if (filters.customDateFrom) {
          const fromDate = new Date(filters.customDateFrom).getTime();
          dateFilter = `publicationDate >= ${fromDate}`;
        }
        if (filters.customDateTo) {
          const toDate = new Date(filters.customDateTo).getTime();
          dateFilter += dateFilter ? ` AND publicationDate <= ${toDate}` : `publicationDate <= ${toDate}`;
        }
        break;
    }
    
    return dateFilter;
  };

  // Fetch documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filterArray: string[] = [];
      if (filters.language !== 'all') filterArray.push(`language = '${filters.language}'`);
      if (filters.displayOnFrontPage !== 'all') filterArray.push(`displayOnFrontPage = ${filters.displayOnFrontPage}`);
      
      // Add date filter
      const dateFilter = getDateFilter();
      if (dateFilter) filterArray.push(dateFilter);
      
      const body: any = {
        q: searchQuery,
        limit: 1000, // Get more results to filter client-side
        offset: 0,
        filter: filterArray.length > 0 ? filterArray.join(' AND ') : undefined,
        sort: ['publicationDate:desc']
      };

      // Add highlighting and cropping when there's a search query
      if (searchQuery) {
        body.attributesToHighlight = ['title', 'subtitle', 'content'];
        body.attributesToCrop = ['content'];
        body.cropLength = 200;
        body.highlightPreTag = '<mark class="bg-yellow-200">';
        body.highlightPostTag = '</mark>';
      }

      const response = await fetch(`${searchHost}/indexes/articles/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${searchKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data: SearchResponse = await response.json();
      setDocuments(data.hits || []);
      setTotalHits(data.estimatedTotalHits || 0);
      setSearchTime(data.processingTimeMs || null);
      
      // Reset filters when new search is performed
      setRelatedContentFilters({});
      setCategoryFilters(new Set());
      setExpandedCategories(new Set());
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false);
  };

  // Fetch index stats
  const fetchIndexStats = async () => {
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
  };

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

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  useEffect(() => {
    fetchIndexStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOffset(0);
    fetchDocuments();
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">
          IBT Admin Search {indexStats && `- ${indexStats.numberOfDocuments} Articles indexed`}
        </h1>

        {/* Reindex Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Index Management</h2>
              <p className="text-sm text-gray-600">Reindex all articles from GraphQL source</p>
            </div>
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
          
          {reindexStatus && (
            <div className={`mt-3 p-3 rounded text-sm ${
              reindexStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
              reindexStatus.includes('❌') ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {reindexStatus}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-2">
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
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
            <button
              type="button"
              onClick={() => setShowImages(!showImages)}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${showImages ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              <ImageIcon size={20} />
              Images
            </button>
            <button
              type="button"
              onClick={() => setShowSnippets(!showSnippets)}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${showSnippets ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              <FileText size={20} />
              Snippets
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Summary Box */}
        {!loading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-900">
              Found {totalHits} results
              {searchQuery && <span> for "{searchQuery}"</span>}
              {searchTime !== null && <span className="text-sm font-normal"> in {searchTime}ms</span>}
            </div>
            {docsWithRelatedContent > 0 && (
              <div className="text-sm text-blue-700 mt-1">
                {docsWithRelatedContent} with related content
              </div>
            )}
            {(categoryFilters.size > 0 || Object.keys(relatedContentFilters).length > 0) && (
              <div className="text-sm text-blue-700 mt-1">
                Showing {totalFilteredHits} filtered results
              </div>
            )}
          </div>
        )}

        {/* Related Content Filters - Simplified with Accordions */}
        {Object.keys(categoryCounts).length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Filter by Related Content</h3>
            
            {/* Category Level Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(categoryCounts).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => toggleCategoryFilter(type)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    categoryFilters.has(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {getIcon(type)}
                  <span className="capitalize">{type}</span>
                  <span className="font-semibold">({count})</span>
                </button>
              ))}
            </div>

            {/* Detailed Filters - Only show for selected categories */}
            {availableRelatedContent
              .filter(({ type }) => categoryFilters.has(type))
              .map(({ type, items, selectedItems }) => {
                const isExpanded = expandedCategories.has(type);
                const allSelected = items.every(item => selectedItems.includes(item.slug));
                
                return (
                  <div key={type} className="border rounded-lg mb-2 bg-white">
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

        {/* Standard Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <div className="space-y-2">
                  {['all', 'en', 'fr'].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value={value}
                        checked={filters.language === value}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                        className="mr-2"
                      />
                      <span className="capitalize">{value === 'all' ? 'All Languages' : value.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="flex text-sm font-medium mb-2 items-center gap-1">
                  <Calendar size={16} /> Date Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'week', label: 'Last Week' },
                    { value: 'month', label: 'Last Month' },
                    { value: 'year', label: 'Last Year' },
                    { value: 'custom', label: 'Custom Range' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="dateRange"
                        value={option.value}
                        checked={filters.dateRange === option.value}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="mr-2"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                  
                  {filters.dateRange === 'custom' && (
                    <div className="ml-6 space-y-2 mt-2">
                      <input
                        type="date"
                        value={filters.customDateFrom}
                        onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                        className="px-3 py-1 border rounded"
                        placeholder="From"
                      />
                      <input
                        type="date"
                        value={filters.customDateTo}
                        onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                        className="px-3 py-1 border rounded ml-2"
                        placeholder="To"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Front Page Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Display on Front Page</label>
                <div className="flex gap-4">
                  {['all', 'true', 'false'].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name="displayOnFrontPage"
                        value={value}
                        checked={filters.displayOnFrontPage === value}
                        onChange={(e) => handleFilterChange('displayOnFrontPage', e.target.value)}
                        className="mr-1"
                      />
                      <span>{value === 'all' ? 'All' : value === 'true' ? 'Yes' : 'No'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex gap-4">
                    {/* Featured Image */}
                    {showImages && doc.featuredImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={doc.featuredImage}
                          alt={doc.featuredImageAlt || doc.title}
                          className="w-32 h-24 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            <a 
                              href={getArticleUrl(doc.uri)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 flex items-center gap-1"
                            >
                              {doc._formatted?.title ? renderHighlightedText(doc._formatted.title) : doc.title}
                              <ExternalLink size={16} />
                            </a>
                          </h3>
                          {doc.subtitle && (
                            <p className="text-gray-600">
                              {doc._formatted?.subtitle ? renderHighlightedText(doc._formatted.subtitle) : doc.subtitle}
                            </p>
                          )}
                          
                          {/* Search Snippet */}
                          {showSnippets && searchQuery && doc._formatted?.content && (
                            <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                              <div className="text-gray-700 italic">
                                ...{renderHighlightedText(doc._formatted.content)}...
                              </div>
                            </div>
                          )}
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span>ID: {doc.databaseId}</span>
                            <span>Lang: {doc.language}</span>
                            <span>Date: {new Date(doc.publicationDate).toLocaleDateString()}</span>
                            {doc.source && <span>Source: {doc.source}</span>}
                            {doc.displayOnFrontPage && <span className="text-green-600">✓ Front Page</span>}
                          </div>

                          {/* Media Indicators */}
                          <div className="flex gap-3 mt-2">
                            {doc.hasRelatedPdf && <span className="text-blue-600 flex items-center gap-1"><FileText size={16} /> PDF</span>}
                            {doc.hasRelatedAudio && <span className="text-green-600 flex items-center gap-1"><Volume2 size={16} /> Audio</span>}
                            {doc.hasRelatedVideo && <span className="text-purple-600 flex items-center gap-1"><Video size={16} /> Video</span>}
                          </div>

                          {/* Places & Topics */}
                          {(doc.places.length > 0 || doc.topics.length > 0) && (
                            <div className="mt-2 text-sm">
                              {doc.places.length > 0 && (
                                <div>Places: {doc.places.join(', ')}</div>
                              )}
                              {doc.topics.length > 0 && (
                                <div>Topics: {doc.topics.join(', ')}</div>
                              )}
                            </div>
                          )}

                          {/* Related Content */}
                          {doc.relatedContent && doc.relatedItemsCount > 0 && (
                            <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
                              <div className="font-medium mb-2">Related Content:</div>
                              <div className="grid grid-cols-2 gap-2">
                                {doc.relatedContent.books?.length > 0 && (
                                  <div>
                                    <span className="flex items-center gap-1 font-medium"><Book size={14} /> Books:</span>
                                    {doc.relatedContent.books.map((book, idx) => (
                                      <a
                                        key={idx}
                                        href={getRelatedUrl('books', book.slug, doc.language)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-5 text-blue-600 hover:underline"
                                      >
                                        {book.title || book.slug}
                                      </a>
                                    ))}
                                  </div>
                                )}
                                {doc.relatedContent.collections?.length > 0 && (
                                  <div>
                                    <span className="flex items-center gap-1 font-medium"><Folder size={14} /> Collections:</span>
                                    {doc.relatedContent.collections.map((collection, idx) => (
                                      <a
                                        key={idx}
                                        href={getRelatedUrl('collections', collection.slug, doc.language)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-5 text-blue-600 hover:underline"
                                      >
                                        {collection.slug}
                                      </a>
                                    ))}
                                  </div>
                                )}
                                {doc.relatedContent.journals?.length > 0 && (
                                  <div>
                                    <span className="flex items-center gap-1 font-medium"><FileArchive size={14} /> Journals:</span>
                                    {doc.relatedContent.journals.map((journal, idx) => (
                                      <a
                                        key={idx}
                                        href={getRelatedUrl('journals', journal.slug, doc.language)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-5 text-blue-600 hover:underline"
                                      >
                                        {journal.title || journal.slug}
                                      </a>
                                    ))}
                                  </div>
                                )}
                                {doc.relatedContent.articles?.length > 0 && (
                                  <div>
                                    <span className="flex items-center gap-1 font-medium"><FileText size={14} /> Related Articles:</span>
                                    {doc.relatedContent.articles.map((article, idx) => (
                                      <a
                                        key={idx}
                                        href={getRelatedUrl('articles', article.slug, doc.language)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-5 text-blue-600 hover:underline"
                                      >
                                        {article.title || article.slug}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 ml-2"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                      
                      {/* JSON View */}
                      {selectedDoc?.id === doc.id && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                          <pre className="text-xs overflow-auto max-h-96">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentOffset(Math.max(0, currentOffset - limit))}
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
                onClick={() => setCurrentOffset(currentOffset + limit)}
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