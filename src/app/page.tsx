import { Metadata } from 'next';
import HomeLayout from './layouts/HomeLayout';
import { fetchGlobalSettings } from './utils/fetchGlobalSettings';
import { fetchLatestJournalIssue } from './utils/fetchLatestJournalIssue';
import { fetchArticles } from './utils/fetchArticles';
import { fetchBooks } from './utils/fetchBooks';

// export const revalidate = 60; // Ensure no caching

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

export default async function Home() {
  const [articles, globalSettings, books, latestJournalIssue] = await Promise.all([
    fetchArticles(),
    fetchGlobalSettings(),
    fetchBooks(),
    fetchLatestJournalIssue(),
  ]);

  return (
    <HomeLayout
      globalSettings={globalSettings}
      articles={articles}
      books={books}
      latestJournalIssue={latestJournalIssue}
    />
  );
}
