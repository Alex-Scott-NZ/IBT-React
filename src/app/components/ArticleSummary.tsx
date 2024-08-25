import React from 'react';
import { FrontPageArticle } from '../types/Article';
import Link from 'next/link';

interface ArticleSummaryProps {
  article: FrontPageArticle;
  className?: string; // Add optional className prop
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, className }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const journalSlug = article.articleDetails.relatedJournal?.edges[0]?.node.slug;
  const journalTitle = article.articleDetails.relatedJournal?.edges[0]?.node.title;

  const dateToDisplay = article.articleDetails.suppressDate
    ? article.articleDetails.displayDate
    : formatDate(article.articleDetails.publicationDate);

  return (
    <div className={className}>
      <Link href={`/article/${article.slug}`} passHref>
        <div className="block mt-5 w-full cursor-pointer text-inherit hover:no-underline hover:text-inherit">
          <div className="relative h-auto w-full flex flex-col">
            <div className="relative z-10 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-communist-red mb-1 mt-1 leading-tight">
                {article.title}
              </h3>
              {article.articleDetails.subtitle && (
                <p className="text-lg font-medium truncate mb-1 mt-1 leading-tight text-black">
                  {article.articleDetails.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      <p className="text-sm mb-1 mt-1 leading-tight text-black">
        {dateToDisplay}
        {journalSlug && (
          <>
            {' '}
            | <Link href={`/journal/${journalSlug}`} passHref>
              <span className='text-communist-red text-base font-cambay'>{journalTitle}</span>
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default ArticleSummary;
