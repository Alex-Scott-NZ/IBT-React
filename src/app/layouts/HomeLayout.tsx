// src/app/layouts/HomeLayout.tsx

import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import { FrontPageArticle, BannerImageNode, Book } from '../types/Article';

interface HomeLayoutProps {
  bannerData: BannerImageNode | null;
  articles: FrontPageArticle[];
  books: Book[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ bannerData, articles, books }) => {
  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<BooksWidget books = {books} />}
      mainContent={<MainContent articles={articles} />}
      rightSidebar={<div>Right Sidebar for Home</div>}
    />
  );
};

export default HomeLayout;