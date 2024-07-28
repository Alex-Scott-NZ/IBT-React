// src/app/components/MainContent.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontPageArticle } from '../types/Article';
import FeaturedArticles from './FeaturedArticles';

interface MainContentProps {
  articles: FrontPageArticle[];
}

const MainContent: React.FC<MainContentProps> = ({ articles }) => {
  const router = useRouter();

  const handleArticleClick = (slug: string) => {
    router.push(`/domain/article/${slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full">
      <FeaturedArticles articles={articles.slice(0, 2)} />

      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">More Articles</h2>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.slice(2).map((article) => (
            <div
              key={article.id}
              className="mb-4 w-full p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleArticleClick(article.slug)}
            >
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="mb-2">
                {article.content.split(' ').slice(0, 50).join(' ')}...
              </p>
              <p className="text-sm text-gray-600">Slug: {article.slug}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainContent;
