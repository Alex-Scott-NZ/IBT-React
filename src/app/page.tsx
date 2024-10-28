import HomeLayout from './layouts/HomeLayout';
import {
  GetArticlesQuery,
  useGetArticlesQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
  GetBooksQuery,
  useGetBooksQuery,
  GetJournalIssuesLatestQuery,
  useGetJournalIssuesLatestQuery,
  GetPlaceholderSettingsQuery,
  useGetPlaceholderSettingsQuery,
} from '../gql/gql-generated';
import { serverFetch } from '../gql/query-utils';
import { Metadata } from 'next';

// Helper function to get largest image info
const getLargestImageInfo = (srcSet: string): { url: string; width: number; height: number } => {
  const images = srcSet.split(', ').map(img => {
    const [url, size] = img.split(' ');
    const width = parseInt(size.replace('w', ''));
    const dimensions = url.match(/-(\d+)x(\d+)\.png$/);
    const height = dimensions ? parseInt(dimensions[2]) : 0;
    return { url, width, height };
  });

  const largestImage = images.reduce((prev, current) =>
    (prev.width > current.width) ? prev : current
  );

  return largestImage;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(useGetGlobalSettingsQuery);

  const bannerImage = globalSettingsData?.globalSettings?.fGGlobalSettings?.bannerImage?.node;
  const twitterBannerImage = globalSettingsData?.globalSettings?.fGGlobalSettings?.bannerImageTwitter?.node;
  const mediaDetails = bannerImage?.mediaDetails;

  return {
    title: 'International Bolshevik Tendency',
    description: 'We stand for a working-class revolution to overthrow capitalism on a global scale.',
    openGraph: {
      title: 'International Bolshevik Tendency',
      description: 'Main page of the International Bolshevik Tendency website',
      url: 'https://headless.saggitari.us',
      siteName: 'International Bolshevik Tendency',
      images: [
        {
          url: bannerImage?.sourceUrl || '',
          width: mediaDetails?.width || 1024,
          height: mediaDetails?.height || 174,
          alt: bannerImage?.altText || 'International Bolshevik Tendency website banner',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@IBT1917',
      title: 'International Bolshevik Tendency',
      description: 'We stand for a working-class revolution to overthrow capitalism on a global scale.',
      images: [twitterBannerImage?.sourceUrl || ''],
    },
  };
};

const Home = async () => {
  // Fetch the required data using your helper functions
  const articlesData: GetArticlesQuery = await serverFetch(useGetArticlesQuery);
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(useGetGlobalSettingsQuery);
  const booksData: GetBooksQuery = await serverFetch(useGetBooksQuery);
  const latestJournalIssueData: GetJournalIssuesLatestQuery = await serverFetch(useGetJournalIssuesLatestQuery);
  const placeholdersData: GetPlaceholderSettingsQuery = await serverFetch(useGetPlaceholderSettingsQuery);

  // Ensure that all data is available, if not, return an error page
  if (
    !articlesData ||
    !globalSettingsData ||
    !booksData ||
    !latestJournalIssueData ||
    !placeholdersData
  ) {
    return {
      notFound: true,
    };
  }

  // Render the HomeLayout with the data as props
  return (
    <HomeLayout
      globalSettings={globalSettingsData}
      articles={articlesData}
      books={booksData}
      latestJournalIssue={latestJournalIssueData}
      placeHolderSettings={placeholdersData}
    />
  );
};

export default Home;
