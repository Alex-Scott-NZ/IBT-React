// /app/[lang]/components/ArticleSummary.tsx
import React from 'react';
import { GetArticlesQuery } from '@/gql/gql-generated';
import Link from 'next/link';

interface ArticleSummaryProps {
  article: NonNullable<GetArticlesQuery['articles']>['nodes'][number]; // Note the [number] to get a single article
  className?: string;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({
  article,
  className,
}) => {
  // 
  // console.log('Article in ArticleSummary:', article);
  // console.log('Article Details:', article.articleDetails);
  // console.log('Related Journal:', article.articleDetails?.relatedJournal);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Updated type guard with more specific typing
  interface JournalIssueNode {
    contentTypeName: 'journal';
    databaseId: number;
    title: string;
    uri: string;
  }

  const isJournalIssue = (node: any): node is JournalIssueNode => {
    return (
      node &&
      node.contentTypeName === 'journal' &&
      typeof node.uri === 'string' &&
      typeof node.title === 'string'
    );
  };

  const journalNode = article.articleDetails?.relatedJournal?.edges?.[0]?.node;
  //
  // console.log('Journal Node:', journalNode); // Debug log

  // Use the type guard before accessing properties
  const journalData = journalNode && isJournalIssue(journalNode)
    ? {
        uri: journalNode.uri,
        title: journalNode.title
      }
    : null;

  const dateToDisplay = article.articleDetails?.suppressDate
    ? article.articleDetails?.displayDate
    : formatDate(article.articleDetails?.publicationDate);

  return (
    <div className={className}>
      <Link href={article.uri!} passHref>
        <div className="block mt-5 w-full cursor-pointer text-inherit hover:no-underline hover:text-inherit">
          <div className="relative h-auto w-full flex flex-col">
            <div className="relative z-10 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-communist-red mb-1 mt-1 leading-none">
                {article.title}
              </h3>
              {article.articleDetails?.subtitle && (
                <p className="text-lg font-medium truncate mb-1 mt-1 leading-tight text-gray-900">
                  {article.articleDetails.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      <p className="text-sm mb-1 mt-1 leading-tight text-black">
        {dateToDisplay}
        {journalData && (
          <>
            {' '}
            |{' '}
            <Link href={`${journalData.uri}`} passHref>
              <span className="text-communist-red text-base font-cambay">
                {journalData.title}
              </span>
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default ArticleSummary;
