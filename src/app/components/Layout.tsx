// src/app/components/Layout.tsx
import React from 'react';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import Header from './Header';
import MainContent from './MainContent';
import { FrontPageArticle, BannerImageNode } from '../types/Article';

interface LayoutProps {
  bannerData: BannerImageNode | null;
  articles: FrontPageArticle[];
}

const Layout: React.FC<LayoutProps> = ({ bannerData, articles }) => {
  return (
    <div className="flex flex-col min-h-screen bg-custom-bg relative">
      <TopBar />
      <Header bannerData={bannerData} />
      <div className="flex justify-center items-start flex-1 bg-custom-bg">
        <div className="flex w-full max-w-[1440px] mx-auto h-full">
          <aside className="w-[360px] bg-custom-bg sticky top-0 h-screen overflow-auto">
            Left Sidebar
          </aside>
          <main className="w-[720px] bg-custom-bg">
            <MainContent articles={articles} />
          </main>
          <aside className="w-[360px] bg-custom-bg sticky top-0 h-screen overflow-auto">
            Right Sidebar
          </aside>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Layout;
