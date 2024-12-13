// app/components/JournalNavigator/index.tsx
import { serverFetch } from '@/gql/query-utils';
import { useGetArticleByUriQuery, GetArticleByUriQuery } from '@/gql/gql-generated';
import JournalNavigatorClient from './JournalNavigatorClient';
import { headers } from 'next/headers';

export default async function JournalNavigator() {
  debugger;
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const isArticlePage = pathname.includes('/article/');
  const articleUri = isArticlePage
    ? `/article/${pathname.split('/article/')[1]}`
    : '';

  if (!isArticlePage) {
    return null;
  }

  try {
    const articleData = await serverFetch(
      useGetArticleByUriQuery,
      {
        variables: { uri: articleUri },
        next: { revalidate: 60 }
      }
    );

    console.log('Server component - articleData:', articleData);

    if (!articleData?.article) {
      console.log('No article data found');
      return null;
    }

    return <JournalNavigatorClient initialData={articleData} />;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return null;
  }
}
