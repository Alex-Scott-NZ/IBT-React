import React from 'react';
import { FrontPageArticle } from '../types/Article';
import { getImageUrl } from '../utils/imageHelpers';
import Link from 'next/link';
import { Divider } from '@mui/material';

interface ArticleSummaryProps {
  article: FrontPageArticle;
  onArticleClick?: (slug: string) => void;
  isFeatured?: boolean;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, onArticleClick, isFeatured }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const content = (
    <div
      className={`relative ${isFeatured ? 'h-56' : 'h-auto'} w-full flex flex-col`}
    >
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
        <h3 className="text-lg font-medium text-communist-red mb-1 leading-tight">
          {article.title}
        </h3>
        {article.articleDetails.subtitle && (
          <p className="text-lg font-medium truncate mb-1 leading-tight">
            {article.articleDetails.subtitle}
          </p>
        )}
        <p className="text-sm mt-auto">
          {formatDate(article.articleDetails.publicationDate)}
        </p>
      </div>
    </div>
  );

  return onArticleClick ? (
    <div
      onClick={() => onArticleClick(article.slug)}
      className="mb-1 w-full cursor-pointer py-1"
      // Increased margin between articles
    >
          <Divider component="li"/> {/* Material-UI Divider */}
      {content}
    </div>
  ) : (
    <Link href={`/article/${article.slug}`} passHref>
      <div className="block mb-1 w-full cursor-pointer py-1">
        {content}
      </div>
    </Link>
  );
};

export default ArticleSummary;
