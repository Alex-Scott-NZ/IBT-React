"use client";

import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import { DetailedArticle, BannerImageNode } from '../types/Article';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: DetailedArticle;
  bannerData: BannerImageNode | null;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article, bannerData }) => {
  const relatedPdf = article.articleDetails?.relatedPdf?.nodes?.[0];
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <BaseLayout
      bannerData={bannerData}
      leftSidebar={<div>Article Left Sidebar</div>}
      mainContent={
        <div style={{ position: 'relative' }}>
          <h1 className='mt-0'>{article.title}</h1>
          {article.articleDetails?.subtitle && (
            <h2>{article.articleDetails.subtitle}</h2>
          )}
          {article.featuredImage?.node && (
            <Image
              src={article.featuredImage.node.sourceUrl}
              alt={article.featuredImage.node.altText || article.title}
              width={688}
              height={0}
              sizes="100vw"
              priority={true}
              quality={75}
              className='w-full h-auto'
              placeholder='blur'
              blurDataURL='data:image/png;base64,LEHLk~WB2yk8pyo0adR*.7kCMdnj'
              style={{ objectFit: 'contain' }}
            />
          )}

          {pdfUrl ? (
            <div style={{ marginTop: '20px', height: '800px' }}>
              <h3>Related PDF: {relatedPdf.title}</h3>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          ) : (
            <div
              style={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '1.6', color: '#333' }}
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          )}
        </div>
      }
      rightSidebar={<div>Article Right Sidebar</div>}
    />
  );
};

export default ArticleLayout;
