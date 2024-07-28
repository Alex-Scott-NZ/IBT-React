import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import Image from 'next/image';

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
    <header className="w-full bg-custom-bg text-white pt-4">
      <Box display="flex" justifyContent="center" className="w-full">
        <Box
          width="1440px"
          display="flex"
          justifyContent="flex-start"
          style={{ margin: 0, padding: 0 }}
        >
          {bannerData && bannerData.sourceUrl ? (
            <Image
              src={bannerData.sourceUrl}
              alt={bannerData.altText}
              title={bannerData.title}
              width={630}
              height={110}
              layout="fixed"
              objectFit="contain"
              style={{ margin: 0, padding: 0 }}
            />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="grey.300"
              width="630px"
              height="110px"
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </header>
  );
};

export default Header;
