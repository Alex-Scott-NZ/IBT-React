import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { GlobalSettingsData } from '../types/Article';
import NavigationMenu from '../components/NavigationMenu';
import SiteWideNotice from '../components/SiteWideNotice';

interface BaseLayoutNoSideBarsProps {
  globalSettings: GlobalSettingsData | null; 
  children: ReactNode;
}

const BaseLayoutNoSideBars: React.FC<BaseLayoutNoSideBarsProps> = ({
  globalSettings,
  children,
}) => {
  return (
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <TopBar />
      <div className="w-full max-w-[1366px] mx-auto pl-2 pr-2 flex-grow flex flex-col">
        <Header globalSettings={globalSettings} />
        <NavigationMenu />
        <SiteWideNotice notificationData={globalSettings?.globalSettings.fGGlobalSettings.notificationBar} />
        <div className="flex flex-col lg:flex-row lg:justify-between pt-2 lg:pt-2">
          <main className="w-full lg:w-[100%] bg-custom-bg lg:pt-2 p-0 overflow-y-auto mb-4">
            {children}
          </main>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default BaseLayoutNoSideBars;
