import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { BannerImageNode } from '../types/Article';
import NavigationMenu from '../components/NavigationMenu';

interface BaseLayoutNoSideBarsProps {
  bannerData: BannerImageNode | null;
  children: ReactNode;
}

const BaseLayoutNoSideBars: React.FC<BaseLayoutNoSideBarsProps> = ({
  bannerData,
  children,
}) => {
  return (
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <TopBar />
      <div className="w-[1440px] mx-auto flex-grow flex flex-col">
        <Header bannerData={bannerData} />
        <NavigationMenu />
        <div className="flex flex-1 justify-center mt-4">
          <main className="w-[1440px] bg-custom-bg p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default BaseLayoutNoSideBars;
