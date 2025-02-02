// /app/[lang]/page.tsx
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
  LanguageCodeFilterEnum
} from '../../gql/gql-generated';
import { serverFetch } from '../../gql/query-utils';
import { Metadata } from 'next';

// Helper function to get largest image info
// const getLargestImageInfo = (
//   srcSet: string
// ): { url: string; width: number; height: number } => {
//   const images = srcSet.split(', ').map((img) => {
//     const [url, size] = img.split(' ');
//     const width = parseInt(size.replace('w', ''));
//     const dimensions = url.match(/-(\d+)x(\d+)\.png$/);
//     const height = dimensions ? parseInt(dimensions[2]) : 0;
//     return { url, width, height };
//   });

//   const largestImage = images.reduce((prev, current) =>
//     prev.width > current.width ? prev : current
//   );

//   return largestImage;
// };

export const generateMetadata = async (): Promise<Metadata> => {
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  const bannerImage =
    globalSettingsData?.globalSettings?.fGGlobalSettings?.bannerImage?.node;
  const twitterBannerImage =
    globalSettingsData?.globalSettings?.fGGlobalSettings?.bannerImageTwitter
      ?.node;
  const mediaDetails = bannerImage?.mediaDetails;

  return {
    title: 'International Bolshevik Tendency',
    description:
      'We stand for a working-class revolution to overthrow capitalism on a global scale.',
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
          alt:
            bannerImage?.altText ||
            'International Bolshevik Tendency website banner',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@IBT1917',
      title: 'International Bolshevik Tendency',
      description:
        'We stand for a working-class revolution to overthrow capitalism on a global scale.',
      images: [twitterBannerImage?.sourceUrl || ''],
    },
  };
};

interface PageProps {
  params: {
    lang: string;
  };
}

const Home = async ({ params: { lang } }: PageProps) => {
  // Fetch all data in parallel using Promise.all
  const language = lang.toUpperCase() === 'EN' ? LanguageCodeFilterEnum.En : LanguageCodeFilterEnum.Fr

  const [
    articlesData,
    globalSettingsData,
    booksData,
    latestJournalIssueData,
    placeholdersData,
  ] = await Promise.all([
    serverFetch(useGetArticlesQuery, {
      variables: { language },
      next: { revalidate: 60 },
    }),
    serverFetch(useGetGlobalSettingsQuery, { next: { revalidate: 60 } }),
    serverFetch(useGetBooksQuery, { next: { revalidate: 60 } }),
    serverFetch(useGetJournalIssuesLatestQuery, { next: { revalidate: 60 } }),
    serverFetch(useGetPlaceholderSettingsQuery, { next: { revalidate: 60 } }),
  ]);

  // Type assertions
  const typedArticlesData = articlesData as GetArticlesQuery;
  const typedGlobalSettingsData = globalSettingsData as GetGlobalSettingsQuery;
  const typedBooksData = booksData as GetBooksQuery;
  const typedLatestJournalIssueData =
    latestJournalIssueData as GetJournalIssuesLatestQuery;
  const typedPlaceholdersData = placeholdersData as GetPlaceholderSettingsQuery;

  // Ensure that all data is available, if not, return an error page
  if (
    !typedArticlesData ||
    !typedGlobalSettingsData ||
    !typedBooksData ||
    !typedLatestJournalIssueData ||
    !typedPlaceholdersData
  ) {
    return {
      notFound: true,
    };
  }

  // Render the HomeLayout with the data as props
  return (
    <HomeLayout
      globalSettings={typedGlobalSettingsData}
      articles={typedArticlesData}
      books={typedBooksData}
      latestJournalIssue={typedLatestJournalIssueData}
      placeHolderSettings={typedPlaceholdersData}
    />
  );
};

export default Home;
