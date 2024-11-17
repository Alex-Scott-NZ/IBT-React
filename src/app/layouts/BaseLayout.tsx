import React, { ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';
import NavigationMenu from '../components/NavigationMenu';
import SiteWideNotice from '../components/SiteWideNotice';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import Image from 'next/image';

interface BaseLayoutProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
  slug?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  globalSettings,
  leftSidebar,
  mainContent,
  rightSidebar,
  slug,
}) => {
  return (
    <div className="bg-custom-bg min-h-screen flex flex-col print:w-full print:bg-white">
      {/* Top bar hidden in print */}
      <div className="print:hidden">
        <TopBar />
      </div>

      {/* Main content area */}
      <div className="w-full max-w-[1108px] mx-auto pl-2 pr-2 flex-grow flex flex-col print:max-w-none print:px-4">
        <div className="print:hidden">
          <Header globalSettings={globalSettings} />
          <NavigationMenu />
          <SiteWideNotice notificationData={globalSettings?.fGGlobalSettings?.notificationBar} />
        </div>
        <div className="flex flex-col nav:flex-row nav:justify-between pt-2 print:w-full">
          <aside className="hidden nav:block w-full nav:w-[20%] mb-4 pl-0 pr-4 print:hidden">
            <div className="sticky custom-scrollbar nav:top-4 overflow-y-auto max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))]">
              {leftSidebar}
            </div>
          </aside>

          <main className="w-full nav:w-[60%] print:mt-4 print:bg-white bg-custom-bg nav:p-2 p-0 overflow-y-auto mb-4">
            {mainContent}
          </main>

          <aside className="hidden nav:block w-full nav:w-[20%] mb-4 pl-4 print:hidden">
            <div className="sticky custom-scrollbar nav:top-4 overflow-y-auto max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))]">
              {rightSidebar}
            </div>
          </aside>
        </div>
      </div>

      {/* Print-only version */}
      <div className="hidden print:block print:mt-4 print:w-full print:px-4 text-center">
        {/* Full-width Title */}
        <div className="mb-8 text-left">
          {/* Title */}
          <span className="print:text-2xl font-telegrafico underlinefont-semibold mb-2 text-black block">
            International Bolshevik Tendency
          </span>
          {/* Full-width URL */}
          <span className="print:text-2xl font-telegrafico font-medium text-black block">
            {slug
              ? `https://bolshevik.org/article/${slug}/`
              : 'https://bolshevik.org/'}
          </span>
        </div>

        {/* Banner and Social Media Links */}
        <div className="grid print:grid-cols-[20%_40%_40%] items-center">
          {/* Banner */}
          <div className="flex justify-start">
            <Image
              src="https://backend.saggitari.us/wp-content/uploads/2024/10/file.png"
              alt="Banner for Print"
              width={127}
              height={127}
              className="rounded-full"
            />
          </div>

          {/* First Social Media Column */}
          <div className="flex flex-col gap-2 text-black justify-center">
            <div className="flex items-center">
              <TwitterIcon className="mr-2 print:w-7 print:h-7" style={{ color: 'black' }} />
              <span className="print:text-lg font-semibold">twitter.com/IBT1917</span>
            </div>
            <div className="flex items-center">
              <EmailIcon className="mr-2 print:w-7 print:h-7" style={{ color: 'black' }} />
              <span className="print:text-lg font-semibold">ibt@bolshevik.org</span>
            </div>
          </div>

          {/* Second Social Media Column */}
          <div className="flex flex-col gap-2 text-black justify-center">
            <div className="flex items-center">
              <FacebookIcon className="mr-2 print:w-7 print:h-7" style={{ color: 'black' }} />
              <span className="print:text-lg font-semibold">facebook.com/Bolsheviks</span>
            </div>
            <div className="flex items-center">
              <YouTubeIcon className="mr-2 print:w-7 print:h-7" style={{ color: 'black' }} />
              <span className="print:text-lg font-semibold">youtube.com/user/ibt1917</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar hidden in print */}
      <div className="print:hidden">
        <BottomBar />
      </div>
    </div>
  );
};

export default BaseLayout;
