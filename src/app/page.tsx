export const revalidate = 60; // Ensure no caching

import { GraphQLClient } from 'graphql-request';
import { GET_FRONT_PAGE_ARTICLES } from './graphql/queries/getFrontPageArticles';
import { GET_GLOBAL_SETTINGS } from './graphql/queries/getGlobalSettings';
import { GET_LATEST_JOURNAL_ISSUE } from './graphql/queries/getLatestJournal';
import {
  GlobalSettingsData,
  BannerImageNode,
  FrontPageArticle,
  ArticlesResponse,
  Book,
  BooksResponse,
  JournalIssueLatest,
} from './types/Article';
import HomeLayout from './layouts/HomeLayout';
import { GET_ALL_BOOKS } from './graphql/queries/getBooksAll';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'max-age=60',
  },
  fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 60 } }),
});

const fetchLatestJournalIssue =
  async (): Promise<JournalIssueLatest | null> => {
    try {
      const data = await graphQLClient.request<{
        journalIssues: { nodes: JournalIssueLatest[] };
      }>(GET_LATEST_JOURNAL_ISSUE);
      return data.journalIssues.nodes[0] || null;
    } catch (error) {
      console.error('Error fetching latest journal issue:', error);
      return null;
    }
  };

const fetchArticles = async (): Promise<FrontPageArticle[]> => {
  try {
    const data = await graphQLClient.request<ArticlesResponse>(
      GET_FRONT_PAGE_ARTICLES
    );
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

const fetchBooks = async (): Promise<Book[]> => {
  try {
    const data = await graphQLClient.request<BooksResponse>(GET_ALL_BOOKS);
    return data.books.nodes;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const fetchBannerData = async (): Promise<BannerImageNode | null> => {
  try {
    const data =
      await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return (
      data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null
    );
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
};

export default async function Home() {
  const [articles, bannerData, books, latestJournalIssue] = await Promise.all([
    fetchArticles(),
    fetchBannerData(),
    fetchBooks(),
    fetchLatestJournalIssue(),
  ]);

  return (
    <HomeLayout
      bannerData={bannerData}
      articles={articles}
      books={books}
      latestJournalIssue={latestJournalIssue}
    />
  );
}
