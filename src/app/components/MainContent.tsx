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

  const handleArticleClick = (slug: string) => {
    router.push(`/article/${slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full">
      {/* Featured Articles */}
      <FeaturedArticles
        articles={articles.slice(0, 2)}
        onArticleClick={handleArticleClick}
      />

      {/* Render remaining articles */}
      <div className="w-full mt-4">
        {articles.slice(2).map((article) => (
          <ArticleSummary key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default MainContent;
