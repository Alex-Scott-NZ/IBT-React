// Define the type for ArticleDetails
interface ArticleDetails {
    displayDate: string;
    displayOnFrontPage: string;
    fieldGroupName: string;
    publicationDate: string;
    source: string;
    subtitle: string;
    suppressDate: string;
    tableOfContentsTitle: string;
}

// Define the type for Article
interface Article {
    slug: string;
    title: string;  // Title of the article
    uri: string;    // URI of the article
    articleDetails: ArticleDetails;
}

// Define the type for FeaturedImageNode
interface FeaturedImageNode {
    mediaDetails: {
        file: string;
        height: number;
        width: number;
    };
    mediaItemId: number;
    srcSet: string;
    slug: string;
    mediaItemUrl: string;
    mediaType: string;
    mimeType: string;
}

// Define the type for JournalIssueDetails
interface JournalIssueDetails {
    fieldGroupName: string;
    publicationDate: string;
    articlesInJournal: {
        nodes: Article[];
    } | null;
}

// Define the type for JournalIssue
export interface JournalIssue {
    title: string;
    featuredImage: {
        node: FeaturedImageNode;
    };
    featuredImageId: number;
    journalIssueDetails: JournalIssueDetails;
}
