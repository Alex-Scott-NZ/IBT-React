'use client';

import React, { ReactNode, useState } from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Header from '../components/Header';
import { GlobalSettingsData } from '../types/Article';
import NavigationMenu from '../components/NavigationMenu';
import { Drawer, IconButton } from '@mui/material';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { styled, lighten } from '@mui/material/styles';

interface BaseLayoutProps {
  globalSettings: GlobalSettingsData | null;
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

// Custom styled IconButton with lightened background and communist-red icons
const CustomIconButton = styled(IconButton)({
  backgroundColor: lighten('#B00909', 0.1),
  color: '#EAEAE2',
  '&:hover': {
    backgroundColor: lighten('#B00909', 0.2),
  },
});


const BaseLayout: React.FC<BaseLayoutProps> = ({
  globalSettings,
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const toggleLeftDrawer = (open: boolean) => () => {
    setLeftDrawerOpen(open);
  };

  const toggleRightDrawer = (open: boolean) => () => {
    setRightDrawerOpen(open);
  };

  return (
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <TopBar />

      <div className="w-full max-w-[1366px] mx-auto pl-2 pr-2 flex-grow flex flex-col">
        <Header globalSettings={globalSettings} />
        <NavigationMenu />

        <div className="flex flex-col lg:flex-row lg:justify-between pt-2 lg:pt-2">
          {/* Drawer Icons */}
          <div className="lg:hidden flex justify-between w-full">
            <CustomIconButton
              onClick={toggleLeftDrawer(true)}
              className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
              sx={{
                justifyContent: 'flex-start', // Align icon to the start (left) within the button
                paddingLeft: '8px', // Optional: fine-tune the space between icon and button edge
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingRight: '4px', // Optional: fine-tune the space between icon and button edge
                marginLeft: '-8px',
                borderRadius: '10%',
                opacity: '0.3',
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </CustomIconButton>
            <CustomIconButton
              onClick={toggleRightDrawer(true)}
              className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
              sx={{
                justifyContent: 'flex-end', // Align icon to the end (right) within the button
                paddingRight: '8px', // Optional: fine-tune the space between icon and button edge
                paddingLeft: '4px',
                paddingTop: '4px',
                paddingBottom: '4px',
                marginRight: '-8px',
                opacity: '0.3',
                borderRadius: '10%',
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </CustomIconButton>
          </div>

          {/* Left Sidebar (Visible on Desktop) */}
          <aside className="hidden lg:block w-full lg:w-[20%] mb-4 lg:pt-2 lg:pr-4">
            <div className="lg:sticky lg:top-4 bg-custom-bg">{leftSidebar}</div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-[60%] bg-custom-bg lg:p-2 lg:pl-4 lg:pr-4 p-0 overflow-y-auto mb-4">
            {mainContent}
          </main>

          {/* Right Sidebar (Visible on Desktop) */}
          <aside className="hidden lg:block w-full lg:w-[20%] lg:pt-2 lg:pl-4 mb-4">
            <div className="lg:sticky lg:top-4 bg-custom-bg">
              {rightSidebar}
            </div>
          </aside>
        </div>
      </div>

      <BottomBar />

      {/* Left Drawer */}
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={toggleLeftDrawer(false)}
        className="lg:hidden"
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#EAEAE2', // Set the background color here
          },
        }}
      >
        <div
          className="w-80 p-2 bg-custom-bg"
          onClick={toggleLeftDrawer(false)}
          onKeyDown={toggleLeftDrawer(false)}
        >
          {leftSidebar}
        </div>
      </Drawer>

      {/* Right Drawer */}
      <Drawer
        anchor="right"
        open={rightDrawerOpen}
        onClose={toggleRightDrawer(false)}
        className="lg:hidden"
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#EAEAE2', // Set the background color here
          },
        }}
      >
        <div
          className="w-80 p-2 bg-custom-bg"
          onClick={toggleRightDrawer(false)}
          onKeyDown={toggleRightDrawer(false)}
        >
          {rightSidebar}
        </div>
      </Drawer>
    </div>
  );
};

export default BaseLayout;
