// src\app\[lang]\components\Header.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';
import LanguageSwitcher from './LanguageSwitcher';
import BannerSearch from './BannerSearch';

interface HeaderProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
  lang: string;
}

const Header = ({ globalSettings, lang }: HeaderProps) => {
  const bannerData = globalSettings?.fGGlobalSettings?.bannerImage;

  const fallbackSVG = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="768" height="131" viewBox="0 0 768 131" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="768" height="131" fill="#4B5563"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="system-ui" font-size="16">
        Image Not Found
      </text>
    </svg>`
  ).toString('base64')}`;

  return (
    <div className="w-full bg-custom-bg text-white">
      <div className="mx-auto max-w-[1108px] relative">
        <header className="pt-3 pb-3 print:pt-0">
          <div className="flex justify-between items-start">
            <div className="w-full md:w-1/2">
              <Link href={`/${lang}`} className="block">
                {bannerData?.node?.mediaDetails ? (
                  <div className="relative aspect-[768/131] max-h-[122px]">
                    <Image
                      src={bannerData.node.sourceUrl || fallbackSVG}
                      alt={bannerData.node.altText || 'Banner Image'}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[768/131] max-h-[122px] animate-pulse bg-gray-300" />
                )}
              </Link>
            </div>
            
            {/* Right side with language switcher and search */}
            <div className="hidden md:flex flex-col items-end gap-3 mt-2">
              <LanguageSwitcher currentLang={lang} />
              <BannerSearch />
            </div>
          </div>
          
          {/* Mobile: Stack language switcher and search */}
          <div className="md:hidden mt-3 flex flex-col items-end gap-2">
            <LanguageSwitcher currentLang={lang} />
            <BannerSearch />
          </div>
        </header>
      </div>
    </div>
  );
};

export default React.memo(Header);