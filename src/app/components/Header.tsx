import React from 'react';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface BannerData {
  sourceUrl: string;
  altText: string;
  title: string;
}

interface HeaderProps {
  bannerData: BannerData | null;
}

const Header: React.FC<HeaderProps> = ({ bannerData }) => {
  return (
    <header className="w-full bg-custom-bg text-white">
      <div className="flex justify-center w-full">
        <div
          className="w-full max-w-[1366px] flex justify-center lg:justify-start"
          style={{ position: "relative", width: "100%", maxWidth: "1366px" }}
        >
          {bannerData && bannerData.sourceUrl ? (
            <div style={{ position: "relative", width: "100%", maxWidth: "630px" }}>
              <Link href="/" passHref>

                <Image
                  src={bannerData.sourceUrl}
                  alt={bannerData.altText}
                  title={bannerData.title}
                  layout="responsive"
                  width= {100}
                  height= {100}
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