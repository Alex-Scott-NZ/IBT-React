import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { BannerImageNode } from '../types/Article';
import NavigationMenu from '../components/NavigationMenu';

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

      <div className="w-full max-w-[1366px] mx-auto pl-2 pr-2 flex-grow flex flex-col">
        <Header bannerData={bannerData} />
        <NavigationMenu />
        <div className="flex flex-col lg:flex-row lg:justify-between lg:pt-4">
          <aside className="w-full lg:w-[25%] mb-4 lg:pt-2 lg:pr-2">
            <div className="lg:sticky lg:top-4 bg-custom-bg">
              {leftSidebar}
            </div>
          </aside>

          <main className="w-full lg:w-[50%] bg-custom-bg lg:p-2 p-0 overflow-y-auto mb-4">
            {mainContent}
          </main>

          <aside className="w-full lg:w-[25%] lg:pt-2 lg:pl-2 mb-4" >
            <div className="lg:sticky lg:top-4 bg-custom-bg">
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