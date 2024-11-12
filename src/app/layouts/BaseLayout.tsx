import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
// import { GlobalSettingsData } from '../types/Article';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';
import NavigationMenu from '../components/NavigationMenu';
import SiteWideNotice from '../components/SiteWideNotice';

interface BaseLayoutProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
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
        <SiteWideNotice notificationData={globalSettings?.fGGlobalSettings?.notificationBar} />

        <div className="flex flex-col nav:flex-row nav:justify-between pt-2 nav:pt-2">
          <aside className="hidden nav:block w-full nav:w-[20%] mb-4 nav:pt-2 nav:pr-4">
            <div className="nav:sticky nav:bottom-4 nav:top-4 bg-custom-bg">
              {leftSidebar}
            </div>
          </aside>

          <main className="w-full nav:w-[60%] bg-custom-bg nav:p-2 nav:pl-4 nav:pr-4 p-0 overflow-y-auto mb-4">
            {mainContent}
          </main>

          <aside className="hidden nav:block w-full nav:w-[20%] mb-4 nav:pt-2 nav:pl-4">
            <div className="nav:sticky nav:top-4 bg-custom-bg">
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
