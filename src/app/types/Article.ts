export interface Article {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    meta: {
      'display-on-front-page': string;
      subtitle: string;
      'table-of-contents-title-optional': string;
      'publication-date': number;
      'suppress-date': string;
      'official-date-of-publication': string;
      'source-optional': string;
      'read-in-other-languages-optional': string;
    };
    _embedded: {
      author: Author[];
      'wp:featuredmedia': Media[];
    };
  }
  
  export interface Author {
    id: number;
    name: string;
    link: string;
  }
  
  export interface Media {
    id: number;
    source_url: string;
  }
  