import React from 'react';
import { Article } from '../types/Article';

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
    </div>
  );
};

export default ArticleCard;
