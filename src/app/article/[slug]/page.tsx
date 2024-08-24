import { GraphQLClient } from 'graphql-request';
import { GET_ARTICLE_BY_URI, GetArticleByUriResponse } from '../../graphql/queries/getArticlesByUri';
import { DetailedArticle } from '../../types/Article';
import ArticleLayout from '../../layouts/ArticleLayout';
import { fetchGlobalSettings } from '@/app/utils/fetchGlobalSettings';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, globalSettings] = await Promise.all([
    fetchArticle(params.slug),
    fetchGlobalSettings()
  ]);

  if (!article) {
    return <div>Article not found</div>;
  }

  return <ArticleLayout article={article} globalSettings={globalSettings} />;
}