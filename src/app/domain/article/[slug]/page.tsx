'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';
import { GET_ARTICLE_BY_URI, GetArticleByUriResponse } from '../../../graphql/queries/getArticlesByUri';
import { DetailedArticle } from '../../../types/Article';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<DetailedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const uri = `/article/${slug}/`;
        const data: GetArticleByUriResponse = await graphQLClient.request(GET_ARTICLE_BY_URI, { uri });
        setArticle(data.article);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      {article.articleDetails?.subtitle && <h2>{article.articleDetails.subtitle}</h2>}
      {article.featuredImage?.node && (
        <img 
          src={article.featuredImage.node.sourceUrl} 
          alt={article.featuredImage.node.altText || article.title} 
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
};

export default ArticlePage;