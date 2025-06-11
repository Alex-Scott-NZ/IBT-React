// src\app\[lang]\components\FeaturedArticles.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { GetArticlesQuery } from '@/gql/gql-generated';

interface FeaturedArticlesProps {
  articles: NonNullable<GetArticlesQuery['articles']>['nodes'];
  onArticleClick: (uri:string) => void;
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).replace(',', '');
  };

  if (articles.length === 0) {
    return <p>No featured articles available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => {
        // Simply use the featuredImage.node directly without the fragment type
        const image = article.featuredImage?.node;
        return (
          <Link href={article.uri!} key={article.id}>
            <div className="relative h-48 overflow-hidden transition-colors hover:bg-gray-400/5">
              {image?.sourceUrl && (
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || article.title || 'Article image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-15% to-black" />
              
              <div className="absolute bottom-0 left-0 w-full p-4 text-gray-200 z-10 flex flex-col justify-end h-full">
                <p className="text-xs mb-0">
                  {article.articleDetails?.suppressDate
                    ? article.articleDetails.displayDate
                    : formatDate(article.articleDetails?.publicationDate)}
                </p>
                <h2 className="text-xl font-bold leading-tight line-clamp-2 mb-0 mt-0">
                  {article.title}
                </h2>
                {article.articleDetails?.subtitle && (
                  <p className="text-sm truncate mb-0">
                    {article.articleDetails.subtitle}
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedArticles;