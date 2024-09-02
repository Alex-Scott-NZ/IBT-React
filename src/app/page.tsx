import { Metadata, GetServerSideProps } from 'next';
import HomeLayout from './layouts/HomeLayout';
import { 
  useGetArticlesQuery, GetArticlesQuery,
  useGetGlobalSettingsQuery, GetGlobalSettingsQuery,
  useGetBooksQuery, GetBooksQuery,
  useGetJournalIssuesLatestQuery, GetJournalIssuesQuery,
  useGetPlaceholderSettingsQuery, GetPlaceholderSettingsQuery
} from '../gql/gql-generated';
import { serverFetch } from '../gql/query-utils';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'International Bolshevik Tendency',
    description: 'We stand for a working-class revolution to overthrow capitalism on a global scale. Our vision is a world without hunger, war, and oppression, in which all human beings may develop their full potential while protecting the environment on which we depend.',
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
      description: 'We stand for a working-class revolution to overthrow capitalism on a global scale. Our vision is a world without hunger, war, and oppression, in which all human beings may develop their full potential while protecting the environment on which we depend.',
      images: ['https://backend.saggitari.us/wp-content/uploads/2024/08/banner-IBT-1200-640.jpg'], // Update with the correct image URL
    },
  };
};

// Define the types for the props
type HomeProps = {
  globalSettings: GetGlobalSettingsQuery;
  articles: GetArticlesQuery;
  books: GetBooksQuery;
  latestJournalIssue: GetJournalIssuesQuery;
  placeholders: GetPlaceholderSettingsQuery;
};

const Home = ({
  globalSettings,
  articles,
  books,
  latestJournalIssue,
  placeholders,
}: HomeProps) => {
  return (
    <HomeLayout
      globalSettings={globalSettings}
      articles={articles}
      books={books}
      latestJournalIssue={latestJournalIssue}
      placeHolderSettings={placeholders}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const articlesData = await serverFetch(useGetArticlesQuery);
  const globalSettingsData = await serverFetch(useGetGlobalSettingsQuery);
  const booksData = await serverFetch(useGetBooksQuery);
  const latestJournalIssueData = await serverFetch(useGetJournalIssuesLatestQuery);
  const placeholdersData = await serverFetch(useGetPlaceholderSettingsQuery);

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

  return {
    props: {
      globalSettings: globalSettingsData.globalSettings,
      articles: articlesData.articles,
      books: booksData.books,
      latestJournalIssue: latestJournalIssueData.journalIssues,
      placeholders: placeholdersData.placeholderSettings,
    },
  };
};

export default Home;