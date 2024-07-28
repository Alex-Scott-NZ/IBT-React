export interface Article {
  id: string;
  title: string;
  content: string;
  featuredImage: {
    cursor: string;
    node: {
      altText: string;
      uri: string;
      title: string;
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

export interface Author {
  id: string;
  name: string;
  link: string;
}

export interface Media {
  id: string;
  sourceUrl: string;
}

export interface ArticlesResponse {
  articles: {
    nodes: Article[];
  };
}
