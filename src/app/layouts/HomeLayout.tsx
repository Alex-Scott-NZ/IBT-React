import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import { FrontPageArticle, BannerImageNode, Book, JournalIssueLatest } from '../types/Article';

type HomeLayoutProps = {
  bannerData: BannerImageNode | null;
  articles: FrontPageArticle[];
  books: Book[];
  latestJournalIssue: JournalIssueLatest | null;
};

const HomeLayout: React.FC<HomeLayoutProps> = ({ bannerData, articles, books, latestJournalIssue }) => {
  // Sort articles by publicationDate
  const sortedArticles = articles.sort((a, b) => {
    const dateA = new Date(a.articleDetails.publicationDate).getTime();
    const dateB = new Date(b.articleDetails.publicationDate).getTime();
    return dateB - dateA; // Sorts in descending order (most recent first)
  });

  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<BooksWidget books={books} />}
      mainContent={<MainContent articles={sortedArticles} />}
      rightSidebar={<LatestJournalIssueWidget latestJournalIssue={latestJournalIssue} />}
    />
  );
};

export default HomeLayout;
