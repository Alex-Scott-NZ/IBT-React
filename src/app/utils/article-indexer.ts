// src/app/utils/article-indexer.ts

import { GraphQLClient } from './graphql-client';
import { getMeilisearchClient } from './meilisearch-client';

const ARTICLES_QUERY = `
  query GetArticlesForIndexing($first: Int!, $after: String) {
    articles(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        slug
        content
        date
        modified
        uri
        link
        status
        featuredImage {
          node {
            sourceUrl
            altText
            mediaItemUrl
          }
        }
        places {
          nodes {
            name
            slug
          }
        }
        topics {
          nodes {
            name
            slug
          }
        }
        articleDetails {
          subtitle
          source
          tableOfContentsTitle
          displayOnFrontPage
          publicationDate
          suppressDate
          displayDate
          relatedPdf {
            nodes {
              ... on PdfItem {
                id
                title
                slug
              }
            }
          }
          relatedAudio {
            nodes {
              ... on AudioItem {
                id
                title
                slug
              }
            }
          }
          relatedVideo {
            nodes {
              ... on VideoItem {
                id
                title
                slug
              }
            }
          }
          relatedArticle {
            nodes {
              ... on Article {
                id
                title
                slug
              }
            }
          }
          relatedBook {
            nodes {
              ... on Book {
                id
                title
                slug
              }
            }
          }
          relatedCollection {
            nodes {
              ... on Collection {
                id
                slug
              }
            }
          }
          relatedJournal {
            nodes {
              ... on JournalIssue {
                id
                title
                slug
              }
            }
          }
        }
      }
    }
  }
`;

interface Article {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string | null;
  date: string;
  modified: string;
  uri: string;
  link: string;
  status: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaItemUrl: string;
    } | null;
  } | null;
  places: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  topics: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  articleDetails: {
    subtitle: string | null;
    source: string | null;
    tableOfContentsTitle: string | null;
    displayOnFrontPage: boolean;
    publicationDate: string;
    suppressDate: boolean;
    displayDate: string | null;
    relatedPdf: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
    relatedAudio: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
    relatedVideo: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
    relatedArticle: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
    relatedBook: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
    relatedCollection: {
      nodes: Array<{
        id: string;
        slug: string;
      }>;
    } | null;
    relatedJournal: {
      nodes: Array<{
        id: string;
        title: string;
        slug: string;
      }>;
    } | null;
  };
}

interface ArticlesQueryResponse {
  articles: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: Article[];
  };
}

export class ArticleIndexer {
  private graphqlClient: GraphQLClient;
  
  constructor() {
    const endpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`;
    this.graphqlClient = new GraphQLClient(endpoint);
  }

  // Strip HTML and clean text
  private stripHtml(html: string | null): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Decode HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  // Extract language from URI
  private extractLanguage(uri: string): string {
    const match = uri.match(/^\/([a-z]{2})\//);
    return match ? match[1] : 'en';
  }

  // Transform article for Meilisearch
  private transformArticle(article: Article) {
    const language = this.extractLanguage(article.uri);
    const places = article.places.nodes.map(p => p.name);
    const topics = article.topics.nodes.map(t => t.name);
    
    // Build full title with subtitle
    const fullTitle = article.articleDetails.subtitle 
      ? `${article.title}: ${article.articleDetails.subtitle}`
      : article.title;
    
    // Get display date
    const displayDate = article.articleDetails.suppressDate && article.articleDetails.displayDate
      ? article.articleDetails.displayDate
      : article.articleDetails.publicationDate;
    
    // Collect related content
    const relatedContent = {
      pdfs: article.articleDetails.relatedPdf?.nodes || [],
      audio: article.articleDetails.relatedAudio?.nodes || [],
      videos: article.articleDetails.relatedVideo?.nodes || [],
      articles: article.articleDetails.relatedArticle?.nodes || [],
      books: article.articleDetails.relatedBook?.nodes || [],
      collections: article.articleDetails.relatedCollection?.nodes || [],
      journals: article.articleDetails.relatedJournal?.nodes || [],
    };
    
    // Count related items
    const relatedItemsCount = Object.values(relatedContent).reduce(
      (sum, items) => sum + items.length, 
      0
    );
    
    return {
      // Use only 'id' as the primary key
      id: `article_${article.databaseId}`,
      
      // Core fields
      databaseId: article.databaseId,
      title: article.title,
      subtitle: article.articleDetails.subtitle,
      fullTitle,
      slug: article.slug,
      content: this.stripHtml(article.content),
      
      // URLs
      uri: article.uri,
      link: article.link,
      
      // Dates
      date: article.date,
      modified: article.modified,
      publicationDate: article.articleDetails.publicationDate,
      displayDate,
      suppressDate: article.articleDetails.suppressDate,
      
      // Metadata
      language,
      source: article.articleDetails.source,
      displayOnFrontPage: article.articleDetails.displayOnFrontPage,
      
      // Taxonomies
      places,
      topics,
      
      // Featured image
      featuredImage: article.featuredImage?.node?.sourceUrl || null,
      featuredImageAlt: article.featuredImage?.node?.altText || null,
      
      // Related content
      relatedContent,
      hasRelatedPdf: relatedContent.pdfs.length > 0,
      hasRelatedAudio: relatedContent.audio.length > 0,
      hasRelatedVideo: relatedContent.videos.length > 0,
      relatedItemsCount,
      
      // Search optimization - combined text field
      _searchableText: [
        article.title,
        article.articleDetails.subtitle || '',
        this.stripHtml(article.content),
        article.articleDetails.source || '',
        places.join(' '),
        topics.join(' '),
      ].join(' ').toLowerCase(),
      
      // Sorting fields
      _rankingScore: article.articleDetails.displayOnFrontPage ? 1 : 0,
    };
  }

  // Fetch all articles
  async fetchAllArticles(): Promise<Article[]> {
    const allArticles: Article[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    
    while (hasNextPage) {
      console.log(`Fetching articles... ${after ? `after cursor: ${after}` : 'first page'}`);
      
      const queryResponse: ArticlesQueryResponse = await this.graphqlClient.query<ArticlesQueryResponse>(
        ARTICLES_QUERY, 
        {
          first: 50,
          after,
        }
      );
      
      allArticles.push(...queryResponse.articles.nodes);
      hasNextPage = queryResponse.articles.pageInfo.hasNextPage;
      after = queryResponse.articles.pageInfo.endCursor;
      
      console.log(`  Fetched ${queryResponse.articles.nodes.length} articles. Total: ${allArticles.length}`);
    }
    
    return allArticles;
  }

  // Index all articles
  async indexArticles() {
    console.log('Starting article indexing...');
    
    // Get the Meilisearch client
    const client = getMeilisearchClient();
    
    // Check if index exists by listing all indexes
    console.log('Checking for existing indexes...');
    const { results: indexes } = await client.getIndexes();
    const indexExists = indexes.some(idx => idx.uid === 'articles');
    
    if (!indexExists) {
      // Create the index with explicit primary key
      console.log('Creating index "articles" with primary key "id"...');
      const createTask = await client.createIndex('articles', { primaryKey: 'id' });
      console.log(`Index creation task: ${createTask.taskUid}`);
      
      // Wait for index creation to complete
      console.log('Waiting for index creation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('Index "articles" already exists');
    }
    
    // Now get the index reference
    const index = client.index('articles');
    
    // Configure index settings
    console.log('Configuring index settings...');
    const settingsTask = await index.updateSettings({
      searchableAttributes: [
        'fullTitle',
        'title',
        'subtitle',
        'content',
        'places',
        'topics',
        'source',
        '_searchableText',
      ],
      displayedAttributes: [
        'id',
        'databaseId',
        'title',
        'subtitle',
        'fullTitle',
        'slug',
        'uri',
        'link',
        'displayDate',
        'publicationDate',
        'language',
        'source',
        'places',
        'topics',
        'featuredImage',
        'featuredImageAlt',
        'hasRelatedPdf',
        'hasRelatedAudio',
        'hasRelatedVideo',
        'relatedItemsCount',
        'displayOnFrontPage',
        'relatedContent',
        'content', 
      ],
      filterableAttributes: [
        'language',
        'places',
        'topics',
        'displayOnFrontPage',
        'hasRelatedPdf',
        'hasRelatedAudio',
        'hasRelatedVideo',
        'publicationDate',
      ],
      sortableAttributes: [
        'publicationDate',
        'date',
        'modified',
        'title',
        '_rankingScore',
      ],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'publicationDate:desc',
        '_rankingScore:desc',
      ],
    });
    console.log(`Settings update task: ${settingsTask.taskUid}`);
    
    // Fetch all articles
    const articles = await this.fetchAllArticles();
    console.log(`Total articles fetched: ${articles.length}`);
    
    // Transform articles
    const documents = articles.map(article => this.transformArticle(article));
    
    // Filter out articles without titles
    const validDocuments = documents.filter(doc => doc.title);
    console.log(`Valid articles to index: ${validDocuments.length}`);
    
    // Add to Meilisearch with explicit primary key
    if (validDocuments.length > 0) {
      const task = await index.addDocuments(validDocuments, { primaryKey: 'id' });
      console.log('Indexing task enqueued:', task.taskUid);
      console.log('Indexing task submitted. Check Meilisearch dashboard for status.');
      
      // Wait a bit to let the task process
      console.log('Waiting for indexing to process...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check final status
      try {
        const stats = await index.getStats();
        console.log(`Index now contains ${stats.numberOfDocuments} documents`);
      } catch (e) {
        console.log('Could not get stats yet, check dashboard for status');
      }
    }
    
    return {
      total: articles.length,
      indexed: validDocuments.length,
    };
  }
}