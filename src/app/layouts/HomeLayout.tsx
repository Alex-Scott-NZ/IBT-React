// src/app/layouts/HomeLayout.tsx

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
  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<BooksWidget books = {books} />}
      mainContent={<MainContent articles={articles} />}
      rightSidebar={<LatestJournalIssueWidget latestJournalIssue={latestJournalIssue} />  }
    />
  );
};

export default HomeLayout;