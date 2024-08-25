import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { GlobalSettingsData } from '../types/Article';
import NavigationMenu from '../components/NavigationMenu';
import SiteWideNotice from '../components/SiteWideNotice';

interface BaseLayoutProps {
  globalSettings: GlobalSettingsData | null;
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  globalSettings,
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  return (
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <TopBar />

      <div className="w-full max-w-[1366px] mx-auto pl-2 pr-2 flex-grow flex flex-col">
        <Header globalSettings={globalSettings} />
        <NavigationMenu />
        <SiteWideNotice notificationData={globalSettings?.globalSettings.fGGlobalSettings.notificationBar} />

        <div className="flex flex-col lg:flex-row lg:justify-between pt-2 lg:pt-2">
          <aside className="hidden lg:block w-full lg:w-[20%] mb-4 lg:pt-2 lg:pr-4">
            <div className="lg:sticky lg:top-4 bg-custom-bg">
              {leftSidebar}
            </div>
          </aside>

          <main className="w-full lg:w-[60%] bg-custom-bg lg:p-2 lg:pl-4 lg:pr-4 p-0 overflow-y-auto mb-4">
            {mainContent}
          </main>

          <aside className="hidden lg:block w-full lg:w-[20%] lg:pt-2 lg:pl-4 mb-4">
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
