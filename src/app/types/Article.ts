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
  };
}

export interface DetailedArticle {
  articleId: number;
  content: string;
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

export interface GlobalSettingsData {
  globalSettings: {
    nodes: {
      fGGlobalSettings: {
        bannerImage: {
          node: BannerImageNode;
        };
      };
    }[];
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

export interface GetArticleByIdResponse {
  article: DetailedArticle;
}
