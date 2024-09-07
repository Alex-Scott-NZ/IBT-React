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

export const generateMetadata = async () => {
  return {
    title: 'International Bolshevik Tendency',
    description: 'We stand for a working-class revolution to overthrow capitalism on a global scale.',
    openGraph: {
      title: 'International Bolshevik Tendency',
      description: 'Main page of the International Bolshevik Tendency website',
      url: 'https://headless.saggitari.us', // Update with your website's URL
      siteName: 'International Bolshevik Tendency',
      images: [
        {
          url: 'https://backend.saggitari.us/wp-content/uploads/2024/08/banner-IBT-1200-640.jpg', // Update with the correct image URL
          width: 1200,
          height: 630,
          alt: 'International Bolshevik Tendency website banner',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'International Bolshevik Tendency',
      description: 'We stand for a working-class revolution to overthrow capitalism on a global scale.',
      images: ['https://backend.saggitari.us/wp-content/uploads/2024/08/banner-IBT-1200-640.jpg'], // Update with the correct image URL
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
