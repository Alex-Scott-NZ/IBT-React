import React from 'react';
import { Article } from '../types/Article';

interface MainContentProps {
  articles: Article[];
}

const MainContent: React.FC<MainContentProps> = ({ articles }) => {
  return (
    <div className="flex flex-col items-center justify-between p-4"> {/* Reduced padding */}
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} className="mb-4">
            <h2>{article.title}</h2>
            <p>{article.content.split(' ').slice(0, 50).join(' ')}...</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MainContent;
