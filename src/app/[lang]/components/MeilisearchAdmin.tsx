// src/app/[lang]/components/MeilisearchAdmin.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Filter, ExternalLink, Image as ImageIcon, FileText, Volume2, Video, Book, Folder, FileArchive, RefreshCw } from 'lucide-react';
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
  const [filters, setFilters] = useState({
    language: 'all',
    hasRelatedPdf: 'all',
    hasRelatedAudio: 'all',
    hasRelatedVideo: 'all',
    displayOnFrontPage: 'all'
  });

  const limit = 10;
  const searchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'https://headless.saggitari.us/search-api';
  const searchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || 'd7d3be8f7e614fff7cdadb3041791b86a7c8f64e928531a2157ea943d7382442';
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || 'http://localhost:3000';

  // Fetch documents
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const filterArray: string[] = [];
      if (filters.language !== 'all') filterArray.push(`language = '${filters.language}'`);
      if (filters.hasRelatedPdf !== 'all') filterArray.push(`hasRelatedPdf = ${filters.hasRelatedPdf}`);
      if (filters.hasRelatedAudio !== 'all') filterArray.push(`hasRelatedAudio = ${filters.hasRelatedAudio}`);
      if (filters.hasRelatedVideo !== 'all') filterArray.push(`hasRelatedVideo = ${filters.hasRelatedVideo}`);
      if (filters.displayOnFrontPage !== 'all') filterArray.push(`displayOnFrontPage = ${filters.displayOnFrontPage}`);
      
      const body: any = {
        q: searchQuery,
        limit: limit,
        offset: currentOffset,
        filter: filterArray.length > 0 ? filterArray.join(' AND ') : undefined,
        sort: ['publicationDate:desc']
      };

      // Add highlighting and cropping when there's a search query
      if (searchQuery) {
        body.attributesToHighlight = ['title', 'subtitle', 'content'];
        body.attributesToCrop = ['content'];
        body.cropLength = 200; // Show 200 characters around the match
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
        
        // Refresh the stats after a delay
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
      
      // Clear status message after 10 seconds
      setTimeout(() => {
        setReindexStatus(null);
      }, 10000);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentOffset, filters]);

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

  const totalPages = Math.ceil(totalHits / limit);
  const currentPage = Math.floor(currentOffset / limit) + 1;

  // Helper to build article URL
  const getArticleUrl = (uri: string) => {
    return `${baseUrl}${uri}`;
  };

  // Helper to build related content URLs
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

  // Helper to render highlighted text
  const renderHighlightedText = (text: string | undefined) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6">Meilisearch Admin Browser</h1>
        
        {/* Stats */}
        {indexStats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold">{indexStats.numberOfDocuments}</div>
              <div className="text-gray-600">Total Documents</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold">{Object.keys(indexStats.fieldDistribution || {}).length}</div>
              <div className="text-gray-600">Total Fields</div>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-2xl font-bold">{totalHits}</div>
              <div className="text-gray-600">Search Results</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <div className="text-2xl font-bold">{documents.filter(d => d.relatedItemsCount > 0).length}</div>
              <div className="text-gray-600">With Related Content</div>
            </div>
          </div>
        )}

        {/* Reindex Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Index Management</h2>
              <p className="text-sm text-gray-600">Last indexed: {indexStats?.numberOfDocuments || 0} documents</p>
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
        <form onSubmit={handleSearch} className="mb-6">
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

        {/* Filters */}
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

              {/* Media Filters */}
              <div>
                <label className="block text-sm font-medium mb-2">Media Types</label>
                <div className="space-y-2">
                  {[
                    { key: 'hasRelatedPdf', label: 'Has PDF', icon: <FileText size={16} /> },
                    { key: 'hasRelatedAudio', label: 'Has Audio', icon: <Volume2 size={16} /> },
                    { key: 'hasRelatedVideo', label: 'Has Video', icon: <Video size={16} /> }
                  ].map(({ key, label, icon }) => (
                    <div key={key}>
                      <span className="flex items-center gap-1 text-sm font-medium mb-1">
                        {icon} {label}
                      </span>
                      <div className="flex gap-4 ml-5">
                        {['all', 'true', 'false'].map(value => (
                          <label key={value} className="flex items-center">
                            <input
                              type="radio"
                              name={key}
                              value={value}
                              checked={filters[key as keyof typeof filters] === value}
                              onChange={(e) => handleFilterChange(key, e.target.value)}
                              className="mr-1"
                            />
                            <span className="text-sm">{value === 'all' ? 'All' : value === 'true' ? 'Yes' : 'No'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
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
              {documents.map((doc) => (
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
                                        className="block ml-5 text-blue-600 hover:underline"
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
                                        className="block ml-5 text-blue-600 hover:underline"
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
                                        className="block ml-5 text-blue-600 hover:underline"
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
                                        className="block ml-5 text-blue-600 hover:underline"
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
                Page {currentPage} of {totalPages} ({totalHits} total)
              </span>
              
              <button
                onClick={() => setCurrentOffset(currentOffset + limit)}
                disabled={currentOffset + limit >= totalHits}
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