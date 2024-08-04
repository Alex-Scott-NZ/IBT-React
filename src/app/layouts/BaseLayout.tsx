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
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <TopBar />

      <div className="w-[1440px] mx-auto flex-grow flex flex-col">
        <Header bannerData={bannerData} />

        <div className="flex flex-1 justify-between mt-4">
          <aside className="w-360px">
            <div className="sticky top-4 bg-gray-200 p-4">
              {leftSidebar}
            </div>
          </aside>

          <main className="w-720px bg-white p-4 overflow-y-auto">
            {mainContent}
          </main>

          <aside className="w-360px">
            <div className="sticky top-4 bg-gray-200 p-4">
              {rightSidebar}
            </div>
          </aside>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default BaseLayout;