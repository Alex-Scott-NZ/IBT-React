import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { BannerImageNode } from '../types/Article';

interface BaseLayoutProps {
  bannerData: BannerImageNode | null;
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  bannerData,
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-custom-bg relative">
      <TopBar />
      <Header bannerData={bannerData} />
      <div className="flex justify-center items-start flex-1 bg-custom-bg">
        <div className="flex w-full max-w-[1440px] mx-auto h-full">
          <aside className="w-[360px] bg-custom-bg sticky top-0 h-screen overflow-auto">
            {leftSidebar}
          </aside>
          <main className="w-[720px] bg-custom-bg">
            {mainContent}
          </main>
          <aside className="w-[360px] bg-custom-bg sticky top-0 h-screen overflow-auto">
            {rightSidebar}
          </aside>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default BaseLayout;