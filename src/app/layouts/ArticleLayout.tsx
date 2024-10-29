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
                    featuredImage.thumbhash || 'data:image/jpeg;base64,...'
                  }
                  sizes="(max-width: 1366px) 100vw, 1366px"
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
