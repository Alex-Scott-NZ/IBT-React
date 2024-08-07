import React from 'react';
import { FrontPageArticle } from '../types/Article';
import { getImageUrl } from '../utils/imageHelpers';
import Link from 'next/link';

interface ArticleSummaryProps {
  article: FrontPageArticle;
  isFeatured?: boolean;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, isFeatured }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <Link href={`/article/${article.slug}`} passHref>
        <div className="block mb-1 w-full cursor-pointer py-1.5 text-inherit hover:no-underline hover:text-inherit">
          <div className={`relative ${isFeatured ? 'h-56' : 'h-auto'} w-full flex flex-col`}>
            {isFeatured && (
              <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImageUrl(article.featuredImage.node, 352)})`,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 33%, rgba(0,0,0,1) 100%)' }}
                />
              </div>
            )}
            <div className="relative z-10 py-1 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-communist-red mb-1 mt-1 leading-tight underline">
                {article.title}
              </h3>
              {article.articleDetails.subtitle && (
                <p className="text-lg font-medium truncate mb-1 mt-1 leading-tight text-black">
                  {article.articleDetails.subtitle}
                </p>
              )}
              <p className="text-sm mt-1 mb-1 leading-tight text-black">
                {formatDate(article.articleDetails.publicationDate)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ArticleSummary;