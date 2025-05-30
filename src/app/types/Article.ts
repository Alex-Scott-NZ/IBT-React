export interface FrontPageArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  featuredImage: {
    cursor: string;
    node: {
      altText: string;
      uri: string;
      title: string;
      sourceUrl: string;
      srcSet: string;
      sizes: string;
    };
  };
  articleDetails: {
    displayDate: string;
    displayOnFrontPage: string;
    fieldGroupName: string;
    publicationDate: string;
    source: string;
    subtitle: string;
    suppressDate: string;
    tableOfContentsTitle: string;
    relatedJournal?: {
      edges: {
        node: {
          contentTypeName: string;
          databaseId: number;
          date: string;
          dateGmt: string;
          featuredImageDatabaseId: number;
          featuredImageId: number;
          guid: string;
          id: string;
          isContentNode: boolean;
          journalIssueId: number;
          link: string;
          slug: string;
          status: string;
          uri: string;
          title: string;
        };
      }[];
    } | null; // Allow for null values
  };
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  authorDatabaseId: number;
  contentTypeName: string;
  featuredImageDatabaseId: number;
  featuredImageId: number;
  isComment: boolean;
  isContentNode: boolean;
  isFrontPage: boolean;
  isPostsPage: boolean;
  isPreview: boolean;
  isRestricted: boolean;
  isTermNode: boolean;
  link: string;
  modified: string;
  modifiedGmt: string;
  parentDatabaseId: number;
  parentId: number;
  password: string | null;
  previewRevisionDatabaseId: number;
  previewRevisionId: number;
  status: string;
  uri: string;
  bookDetails: {
    displayOnIbtBooks: boolean;
    fieldGroupName: string;
    subheading: string;
    summary: string;
    relatedArticles: {
      edges: {
        node: {
          contentTypeName: string;
          guid: string;
          id: string;
          link: string;
          slug: string;
          status: string;
          title: string;
          uri: string;
          articleDetails: {
            tableOfContentsTitle: string | null;
            subtitle: string | null;
            displayDate: string | null;
            displayOnFrontPage: boolean;
            publicationDate: string;
          };
        };
      }[] | null;
    };
  };
  featuredImage: {
    node: {
      altText: string;
      link: string;
      mediaItemId: number;
      mediaItemUrl: string;
      description: string;
      guid: string;
      id: string;
      sizes: string;
      slug: string;
      sourceUrl: string;
      srcSet: string;
    };
  };
}


export interface BooksResponse {
  books: {
    nodes: Book[];
  };
}


export interface DetailedArticle {
  articleId: number;
  content: string | null;
  contentTypeName: string;
  databaseId: number;
  date: string;
  dateGmt: string;
  featuredImageDatabaseId: number;
  featuredImageId: string;
  id: string;
  isTermNode: boolean;
  modified: string;
  modifiedGmt: string;
  parentDatabaseId: number | null;
  parentId: string | null;
  password: string | null;
  previewRevisionDatabaseId: number | null;
  previewRevisionId: string | null;
  slug: string;
  status: string;
  title: string;
  uri: string;
  articleDetails: {
    displayDate: string | null;
    displayOnFrontPage: boolean;
    fieldGroupName: string;
    publicationDate: string;
    source: string | null;
    subtitle: string | null;
    suppressDate: boolean;
    tableOfContentsTitle: string | null;
    relatedPdf?: {
      nodes: Array<{
        contentTypeName: string;
        databaseId: number;
        date: string;
        dateGmt: string;
        desiredSlug: string | null;
        enclosure: string | null;
        guid: string;
        hasPassword: boolean;
        id: string;
        isComment: boolean;
        isContentNode: boolean;
        isFrontPage: boolean;
        isPostsPage: boolean;
        isPreview: boolean;
        isRestricted: boolean;
        isTermNode: boolean;
        link: string;
        modified: string;
        modifiedGmt: string;
        password: string | null;
        pdfItemId: number;
        previewRevisionDatabaseId: number | null;
        previewRevisionId: string | null;
        slug: string;
        status: string;
        title: string;
        uri: string;
        pdfItemDetails?: {
          fieldGroupName: string;
          pdfFile?: {
            cursor: string;
            node: {
              fileSize: number;
              link: string;
              mediaDetails: {
                file: string | null;
                height: number | null;
                width: number | null;
                sizes: string | null;
              };
              slug: string;
              sourceUrl: string | null;
              srcSet: string | null;
              contentTypeName: string;
              contentType: {
                node: {
                  canExport: boolean | null;
                  deleteWithUser: boolean | null;
                  description: string;
                  excludeFromSearch: boolean | null;
                  graphqlPluralName: string;
                  graphqlSingleName: string;
                  hasArchive: boolean | null;
                  hierarchical: boolean;
                  id: string;
                  isComment: boolean;
                  isContentNode: boolean;
                  isFrontPage: boolean;
                  isPostsPage: boolean;
                  isRestricted: boolean;
                  isTermNode: boolean;
                  label: string;
                  menuIcon: string | null;
                  menuPosition: number | null;
                  name: string;
                  public: boolean | null;
                  publiclyQueryable: boolean | null;
                  restBase: string | null;
                  restControllerClass: string | null;
                  showInAdminBar: boolean | null;
                  showInGraphql: boolean;
                  showInMenu: boolean | null;
                  showInNavMenus: boolean | null;
                  showInRest: boolean | null;
                  showUi: boolean | null;
                  uri: string | null;
                };
              };
              mediaItemId: number;
              mediaItemUrl: string;
              mediaType: string;
              mimeType: string;
              sizes: string | null;
              uri: string;
              title: string;
            };
          };
          relatedArticle?: {
            nodes: Array<{
              uri: string;
              articleId: number;
              content: string | null;
              contentTypeName: string;
              databaseId: number;
              date: string;
              dateGmt: string;
              desiredSlug: string | null;
              enclosure: string | null;
              featuredImageDatabaseId: number;
              featuredImageId: string;
              guid: string;
              hasPassword: boolean;
              id: string;
              isComment: boolean;
              isContentNode: boolean;
              isFrontPage: boolean;
              isPostsPage: boolean;
              isPreview: boolean;
              isRestricted: boolean;
              isTermNode: boolean;
              link: string;
              modified: string;
              modifiedGmt: string;
              parentDatabaseId: number | null;
              parentId: string | null;
              password: string | null;
              previewRevisionDatabaseId: number | null;
              previewRevisionId: string | null;
              slug: string;
              status: string;
              title: string;
            }>;
          };
        };
      }>;
    };
  };
  featuredImage: {
    cursor: string;
    node: {
      altText: string;
      authorDatabaseId: number;
      authorId: string;
      caption: string | null;
      contentTypeName: string;
      databaseId: number;
      date: string;
      dateGmt: string;
      description: string | null;
      desiredSlug: string | null;
      fileSize: number;
      guid: string;
      hasPassword: boolean;
      id: string;
      mediaItemId: number;
      mediaItemUrl: string;
      mediaType: string;
      mimeType: string;
      modified: string;
      modifiedGmt: string;
      parentDatabaseId: number;
      parentId: string;
      sizes: string;
      slug: string;
      sourceUrl: string;
      srcSet: string;
      title: string;
      uri: string;
    };
  };
}

export interface BannerImageNode {
  sourceUrl: string;
  altText: string;
  title: string;
}

export interface SiteNotificationData{
  fieldGroupName: string;
  notificationMessage: string;
  notificationOnoff: boolean;
}

export interface GlobalSettingsData {
  globalSettings: {
      fGGlobalSettings: {
        bannerImage: {
          node: BannerImageNode;
        };
        notificationBar: SiteNotificationData
      };
  };
}

export interface ArticlesResponse {
  articles: {
    nodes: FrontPageArticle[];
  };
}

export interface GetArticleByIdResponse {
  article: DetailedArticle;
}

export interface ArticleDetails {
  displayDate: string | null;
  displayOnFrontPage: boolean;
  fieldGroupName: string;
  publicationDate: string;
  source: string | null;
  subtitle: string | null;
  suppressDate: boolean;
  tableOfContentsTitle: string | null;
}

export interface ArticleNode {
  id: string;
  title: string;
  slug: string;
  articleDetails: ArticleDetails;
}

export interface ArticlesInJournal {
  nodes: ArticleNode[];
}

export interface JournalIssueDetails {
  articlesInJournal: ArticlesInJournal | null;
  fieldGroupName: string;
  publicationDate: string;
}

export interface FeaturedImageNode {
  sourceUrl: string; 
  altText: string | null;
  mediaItemId: number;
  srcSet: string | null;
}

export interface JournalIssueNode {
  journalIssueDetails: JournalIssueDetails;
  slug: string;
  title: string;
  featuredImage: {
    node: FeaturedImageNode;
  };
}

export interface JournalIssuesResponse {
  journalIssues: {
    nodes: JournalIssueNode[];
  };
}

// Define the type for the JournalIssue response
export interface JournalIssueLatest {
  fieldGroupName: string;
  publicationDate: string;
  slug: string;
  title: string;
  featuredImage: {
    node: {
      altText: string;
      mediaItemId: string;
      srcSet: string;
      sourceUrl: string;
    };
  };
}

