// src/app/components/FeaturedArticles.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontPageArticle } from '../types/Article';
import { getImageUrl } from '../utils/imageHelpers';

interface FeaturedArticlesProps {
    articles: FrontPageArticle[];
  }
  
  const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
    const router = useRouter();
  
    const handleArticleClick = (slug: string) => {
      router.push(`/domain/article/${slug}`);
    };
  
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <div 
            key={article.id}
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-md"
            onClick={() => handleArticleClick(article.slug)}
          >
            {article.featuredImage?.node && (
              <img 
                src={getImageUrl(article.featuredImage, 768)}
                alt={article.featuredImage.node.altText || article.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <p className="text-sm">{new Date(article.articleDetails.publicationDate).toLocaleDateString()}</p>
              <h2 className="text-xl font-bold">{article.title}</h2>
              {article.articleDetails.subtitle && (
                <p className="text-sm mt-1">{article.articleDetails.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default FeaturedArticles;