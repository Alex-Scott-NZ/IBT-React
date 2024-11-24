import Image from 'next/image';
import Link from 'next/link';
import { GetGlobalSettingsQuery } from '@/gql/gql-generated';

interface HeaderProps {
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
}

const Header = ({ globalSettings }: HeaderProps) => {
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
    <header className="w-full bg-custom-bg text-white">
      <div className="mx-auto max-w-[1366px] pt-6 print:pt-0">
        <div className="w-full md:w-1/2">
          <Link href="/" className="block">
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
      </div>
    </header>
  );
};

export default Header;
