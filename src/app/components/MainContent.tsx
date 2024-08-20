'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontPageArticle } from '../types/Article';
import FeaturedArticles from './FeaturedArticles';
import ArticleSummary from './ArticleSummary';

interface MainContentProps {
  articles: FrontPageArticle[];
}

const MainContent: React.FC<MainContentProps> = ({ articles }) => {
  const router = useRouter();

  // Sort articles by publication date in descending order
  const sortedArticles = articles.sort((a, b) => {
    const dateA = new Date(a.articleDetails.publicationDate);
    const dateB = new Date(b.articleDetails.publicationDate);
    return dateB.getTime() - dateA.getTime(); // Newest articles first
  });

  const handleArticleClick = (slug: string) => {
    router.push(`/article/${slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full">
      {/* Featured Articles */}
      <FeaturedArticles
        articles={sortedArticles.slice(0, 2)} // Use sorted articles for featured section
        onArticleClick={handleArticleClick}
      />

      {/* Render remaining articles */}
      <div className="w-full mt-4">
        {sortedArticles.slice(2).map((article) => (
          <ArticleSummary key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
