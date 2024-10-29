import React from 'react';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';

interface HeaderProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'] // Accept the entire globalSettings object
}

const Header: React.FC<HeaderProps> = ({ globalSettings }) => {
  const bannerData = globalSettings?.fGGlobalSettings?.bannerImage
  // const notificationData = globalSettings?.globalSettings.fGGlobalSettings.notificationBar;

  return (
    <header className="w-full bg-custom-bg text-white">
      <div className="flex justify-center w-full">
        <div
          className="w-full max-w-[1366px] flex justify-start mt-4"
          style={{ position: "relative", width: "100%", maxWidth: "1366px" }}
        >
          {bannerData && bannerData.node.sourceUrl ? (
            <div style={{ position: "relative", width: "630px", maxHeight: "122px" }}>
              <Link href="/" passHref>
                <Image
                  src={bannerData.node.sourceUrl}
                  alt={bannerData.node.altText || 'Banner Image'}
                  // title={bannerData.title || ''}
                  layout="responsive"
                  priority
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
