import React from 'react';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { GlobalSettingsData } from '../types/Article'; // Import the GlobalSettingsData type

interface HeaderProps {
  globalSettings: GlobalSettingsData | null; // Accept the entire globalSettings object
}

const Header: React.FC<HeaderProps> = ({ globalSettings }) => {
  const bannerData = globalSettings?.globalSettings.fGGlobalSettings.bannerImage.node;
  // const notificationData = globalSettings?.globalSettings.fGGlobalSettings.notificationBar;

  return (
    <header className="w-full bg-custom-bg text-white mt-2">
      <div className="flex justify-center w-full">
        <div
          className="w-full max-w-[1366px] flex justify-start"
          style={{ position: "relative", width: "100%", maxWidth: "1366px" }}
        >
          {bannerData && bannerData.sourceUrl ? (
            <div style={{ position: "relative", width: "630px", maxHeight: "122px" }}>
              <Link href="/" passHref>
                <Image
                  src={bannerData.sourceUrl}
                  alt={bannerData.altText}
                  title={bannerData.title || ''}
                  layout="responsive"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center bg-gray-300 w-full max-w-[630px] h-[110px]">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
