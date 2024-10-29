// 'use client'
import React from 'react';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';

interface HeaderProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings']; // Accept the entire globalSettings object
}

const Header: React.FC<HeaderProps> = ({ globalSettings }) => {
  const bannerData = globalSettings?.fGGlobalSettings?.bannerImage;

  const fallbackSVG = `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="768" height="131" viewBox="0 0 768 131" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="768" height="131" fill="#4B5563"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="system-ui" font-size="16">
        Image Not Found
      </text>
    </svg>
    `
  ).toString('base64')}`;

  return (
    <header className="w-full bg-custom-bg text-white">
      <div className="mx-auto max-w-[1366px] pt-6">
        <div className="w-full md:w-1/2">
          {' '}
          {/* Full width on mobile, 50% on desktop */}
          <Link href="/" className="block">
            {bannerData && bannerData.node.mediaDetails ? (
              <div className="relative aspect-[768/131] max-h-[122px]">
                <Image
                  src={
                    bannerData.node.sourceUrl ||
                    fallbackSVG
                  }
                  alt={bannerData.node.altText || 'Banner Image'}
                  fill
                  priority={true}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[768/131] max-h-[122px] flex justify-center items-center bg-gray-300">
                <CircularProgress />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
