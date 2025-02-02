// components/MainContent.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import FeaturedArticles from './FeaturedArticles';
import ArticleSummary from './ArticleSummary';
import { GetArticlesQuery, PlaceholderSettingsFieldsPlaceholderSetup } from '@/gql/gql-generated';

interface MainContentProps {
  articles: GetArticlesQuery
  placeholders: PlaceholderSettingsFieldsPlaceholderSetup[];
}

const MainContent: React.FC<MainContentProps> = ({ articles }) => {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || 'en'

  // Sort articles by publication date in descending order
  const sortedArticles = articles.articles?.nodes.sort((a, b) => {
    const dateA = new Date(a.articleDetails!.publicationDate);
    const dateB = new Date(b.articleDetails!.publicationDate);
    return dateB.getTime() - dateA.getTime(); // Newest articles first
  });

  const handleArticleClick = (uri: string) => {
    router.push(uri);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full">
      {/* Featured Articles - only visible on desktop */}
      <div className="hidden nav:block w-full">
        <FeaturedArticles
          articles={sortedArticles!.slice(0, 2)} // Display the first two articles as featured on desktop
          onArticleClick={handleArticleClick}
        />
      </div>

      {/* Render all articles with the same layout on mobile and non-featured articles on desktop */}
      <div className="w-full mt-0">
        {sortedArticles!.map((article, index) => (
          <ArticleSummary 
            key={article.id} 
            article={article} 
            className={index < 2 ? 'lg:hidden' : ''} // Hide the first two articles on mobile if they are featured on desktop
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;