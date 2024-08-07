import { GraphQLClient } from 'graphql-request';
import { GET_FRONT_PAGE_ARTICLES } from './graphql/queries/getFrontPageArticles';
import { GET_GLOBAL_SETTINGS } from './graphql/queries/getGlobalSettings';
import {
  GlobalSettingsData,
  BannerImageNode,
  FrontPageArticle,
  ArticlesResponse,
} from './types/Article';
import HomeLayout from './layouts/HomeLayout';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL; // Note: Changed from NEXT_PUBLIC_WORDPRESS_API_URL
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'no-store'
  }
});


const fetchArticles = async (): Promise<FrontPageArticle[]> => {
  try {
    const data = await graphQLClient.request<ArticlesResponse>(
      GET_FRONT_PAGE_ARTICLES, 
      {}, 
      { cache: 'no-store' }
    );
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};


const fetchBannerData = async (): Promise<BannerImageNode | null> => {
  try {
    const data =
      await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return (
      data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null
    );
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
};

export default async function Home() {
  const [articles, bannerData] = await Promise.all([
    fetchArticles(),
    fetchBannerData()
  ]);

  return <HomeLayout bannerData={bannerData} articles={articles} />;
}