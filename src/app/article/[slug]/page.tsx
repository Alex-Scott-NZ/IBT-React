import { GraphQLClient } from 'graphql-request';
import { GET_ARTICLE_BY_URI, GetArticleByUriResponse } from '../../graphql/queries/getArticlesByUri';
import { GET_GLOBAL_SETTINGS } from '../../graphql/queries/getGlobalSettings';
import { DetailedArticle, BannerImageNode, GlobalSettingsData } from '../../types/Article';
import ArticleLayout from '../../layouts/ArticleLayout';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL; ;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

async function fetchArticle(slug: string): Promise<DetailedArticle | null> {
  try {
    const uri = `/article/${slug}/`;
    const data: GetArticleByUriResponse = await graphQLClient.request(GET_ARTICLE_BY_URI, { uri });
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function fetchBannerData(): Promise<BannerImageNode | null> {
  try {
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null;
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, bannerData] = await Promise.all([
    fetchArticle(params.slug),
    fetchBannerData()
  ]);

  if (!article) {
    return <div>Article not found</div>;
  }

  return <ArticleLayout article={article} bannerData={bannerData} />;
}