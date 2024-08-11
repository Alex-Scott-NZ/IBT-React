"use client"
import React from 'react';
import Image from 'next/image';
import BaseLayout from './BaseLayout';
import { DetailedArticle, BannerImageNode } from '../types/Article';
// import { getImageUrl } from '../utils/imageHelpers';

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
        <div style={{position: 'relative'}}>
          <h1 className='mt-0'>{article.title}</h1>
          {article.articleDetails?.subtitle && (
            <h2>{article.articleDetails.subtitle}</h2>
          )}
          {article.featuredImage?.node && (
            // Assuming getImageUrl expects an object with sourceUrl and srcSet
            // <Image
            //   src={getImageUrl({
            //     srcSet: article.featuredImage?.node.srcSet,
            //     sourceUrl: article.featuredImage?.node.sourceUrl,
            //   }, 630)}
            //   alt={article.featuredImage.node.altText || article.title}
            //   width={630}
            //   height={110}
            //   style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            // />
            <Image
            src={article.featuredImage.node.sourceUrl}
            alt={article.featuredImage.node.altText || article.title}
            width={0}
            height={0}
            sizes="100vw"
            priority={true} // Ensure it's not lazy-loaded
            quality={75} // Adjust image quality as needed
className='w-full h-auto'
           

          />

          )}
          <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '1.6', color: '#333' }} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      }
      rightSidebar={<div>Article Right Sidebar</div>}
    />
  );
};

export default ArticleLayout;