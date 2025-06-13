// src\app\[lang]\layouts\BaseLayout.tsx
import { Suspense, ReactNode } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import SiteWideNotice from '../components/SiteWideNotice';
import LoadingFallback from '../components/LoadingFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';
import dynamic from 'next/dynamic';

interface BaseLayoutProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar?: ReactNode;
  slug?: string;
  isLoading?: boolean;
  lang: string;
}

const NavigationMenu = dynamic(() => import('../components/NavigationMenu'), {
  ssr: true, // Enable SSR for immediate rendering
});

const PrintLayout = dynamic(() => import('./PrintLayout'), {
  suspense: true,
});

const BaseLayout = ({
  globalSettings,
  leftSidebar,
  mainContent,
  rightSidebar,
  slug,
  isLoading,
  lang,
}: BaseLayoutProps) => {
  if (isLoading) {
    return <LoadingFallback variant="default" />;
  }

  // Check if there's a right sidebar
  const hasRightSidebar = !!rightSidebar;

  // Decide widths dynamically
  const leftSidebarWidth = hasRightSidebar ? 'nav:w-[20%]' : 'nav:w-[30%]';
  const mainContentWidth = hasRightSidebar ? 'nav:w-[60%]' : 'nav:w-[70%]';

  return (
    <ErrorBoundary>
      <div className="bg-custom-bg min-h-screen flex flex-col print:w-full print:bg-white">
        <div className="print:hidden">
          <TopBar />
        </div>

        <div className="w-full max-w-[1108px] mx-auto pl-2 pr-2 flex-grow flex flex-col print:max-w-none print:px-4">
          <div className="print:hidden">
            <Header globalSettings={globalSettings} lang={lang} />
            <NavigationMenu lang={lang} />
            <SiteWideNotice
              notificationData={
                globalSettings?.fGGlobalSettings?.notificationBar
              }
            />
          </div>

          <div className="flex flex-col nav:flex-row nav:justify-between pt-4 print:w-full">
            {/* Left Sidebar */}
            <aside
              className={`hidden nav:block w-full ${leftSidebarWidth} print:hidden`}
            >
              <div
                className="sticky custom-scrollbar nav:top-4 overflow-y-auto max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))] mr-10"
                style={{ paddingRight: '10px' }}
              >
                <Suspense fallback={<LoadingFallback variant="sidebar" />}>
                  <ErrorBoundary>{leftSidebar}</ErrorBoundary>
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <main
              className={`w-full ${mainContentWidth} print:mt-4 print:bg-white bg-custom-bg mb-4`}
            >
              <Suspense fallback={<LoadingFallback variant="article" />}>
                <ErrorBoundary>{mainContent}</ErrorBoundary>
              </Suspense>
            </main>

            {/* Conditionally render the Right Sidebar */}
            {hasRightSidebar && (
              <aside className="hidden nav:block w-full nav:w-[20%] print:hidden">
                <div className="sticky custom-scrollbar nav:top-4 overflow-y-auto max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))] ml-4">
                  <Suspense fallback={<LoadingFallback variant="sidebar" />}>
                    <ErrorBoundary>{rightSidebar}</ErrorBoundary>
                  </Suspense>
                </div>
              </aside>
            )}
          </div>
        </div>

        <Suspense fallback={<LoadingFallback variant="compact" />}>
          <ErrorBoundary>
            <PrintLayout slug={slug} />
          </ErrorBoundary>
        </Suspense>

        <div className="print:hidden">
          <BottomBar />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BaseLayout;
