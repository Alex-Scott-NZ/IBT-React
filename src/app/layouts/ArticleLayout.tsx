import React from 'react';
import Image from 'next/image';
import BaseLayout from './BaseLayout';
import { DetailedArticle, BannerImageNode } from '../types/Article';

interface ArticleLayoutProps {
  article: DetailedArticle;
  bannerData: BannerImageNode | null;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article, bannerData }) => {
  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<div>Article Left Sidebar</div>}
      mainContent={
        <div>
          <h1 className='mt-0'>{article.title}</h1>
          {article.articleDetails?.subtitle && (
            <h2>{article.articleDetails.subtitle}</h2>
          )}
          {article.featuredImage?.node && (
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.featuredImage.node.altText || article.title}
              width={630}
              height={110}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      }
      rightSidebar={<div>Article Right Sidebar</div>}
    />
  );
};

export default ArticleLayout;