import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import {
  GetGlobalSettingsQuery,
  GetArticleByUriQuery,
  PdfItem,
} from '@/gql/gql-generated';
import PdfViewerComponent from './PdfViewerComponent';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: GetArticleByUriQuery['article'];
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
}

const ArticleLayout = ({ article, globalSettings }: ArticleLayoutProps) => {
  const relatedPdf = article?.articleDetails?.relatedPdf?.nodes?.[0] as PdfItem;
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl || '';
  const featuredImage = article?.featuredImage?.node;

  const fallbackSVG = `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="768" height="131" viewBox="0 0 768 131" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="768" height="131" fill="#4B5563"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="system-ui" font-size="16">
        Image Not Found
      </text>
    </svg>
    `
  ).toString('base64')}`;

  return (
    <BaseLayout
      globalSettings={globalSettings}
      leftSidebar={<div>Article Left Sidebar</div>}
      mainContent={
        <div>
          {!pdfUrl && (
            <>
              <h1 className="mt-0">{article?.title}</h1>
              {article?.articleDetails?.subtitle && (
                <h2>{article.articleDetails.subtitle}</h2>
              )}
              {featuredImage && (
                <Image
                  src={featuredImage.sourceUrl || ''}
                  alt={featuredImage.altText || article.title || ''}
                  width={Number(featuredImage.mediaDetails?.width || 0)}
                  height={Number(featuredImage.mediaDetails?.height || 0)}
                  priority={true}
                  quality={75}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL={
                    featuredImage.thumbhash || fallbackSVG
                  }
                  sizes="(max-width: 1050px) 100vw, 780px"
                  style={{
                    maxWidth: '100%',
                  }}
                />
              )}
            </>
          )}

          {pdfUrl ? (
            <PdfViewerComponent pdfUrl={pdfUrl} />
          ) : (
            <div
              className="font-helvetica text-lg leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: article?.content || '' }}
            />
          )}
        </div>
      }
      rightSidebar={<div>Article Right Sidebar</div>}
    />
  );
};

export default ArticleLayout;
