// src/app/layouts/HomeLayout.tsx

import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import { FrontPageArticle, BannerImageNode } from '../types/Article';

interface HomeLayoutProps {
  bannerData: BannerImageNode | null;
  articles: FrontPageArticle[];
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ bannerData, articles }) => {
  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<div>Left Sidebar for Home</div>}
      mainContent={<MainContent articles={articles} />}
      rightSidebar={<div>Right Sidebar for Home</div>}
    />
  );
};

export default HomeLayout;