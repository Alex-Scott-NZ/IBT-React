import {
  GetArticleByUriQuery,
  useGetArticleByUriQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '../../../gql/gql-generated';
import ArticleLayout from '../../layouts/ArticleLayout';
import { serverFetch } from '@/gql/query-utils';

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { context?: string };
}) {
  const uri = `/article/${params.slug}/`;

  // OPTIONAL: read the context (e.g. 'book') from the query string
  const context = searchParams?.context;

  // Fetch the required data using serverFetch
  const articleData: GetArticleByUriQuery = await serverFetch(
    useGetArticleByUriQuery,
    {
      variables: { uri },
      next: { revalidate: 60 },
    }
  );
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  // Check if the article exists
  if (!articleData.article) {
    return <div>Article not found</div>;
  }

  // Render the ArticleLayout with the data as props
  return (
    <ArticleLayout
      article={articleData.article}
      globalSettings={globalSettingsData.globalSettings}
      slug={params.slug} 
      context={context} // Pass context down to ArticleLayout
    />
  );
}
