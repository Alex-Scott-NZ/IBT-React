'use client';

import React, { useEffect, useState } from 'react';
import BaseLayout from './BaseLayout';
import Image from "next/legacy/image";
import { GetGlobalSettingsQuery, GetArticleByUriQuery, PdfItem } from '@/gql/gql-generated';
import { getImagePlaceholder } from '../actions/getPlaceHolder';
import PdfViewerComponent from './PdfViewerComponent';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: GetArticleByUriQuery['article'];
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
}

interface ImagePlaceholder {
  src: string;
  placeholder: string;
}

const DEFAULT_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==';

const ArticleLayout = ({ article, globalSettings }: ArticleLayoutProps) => {
  const [imageWithPlaceholder, setImageWithPlaceholder] = useState<ImagePlaceholder>({
    src: '',
    placeholder: DEFAULT_PLACEHOLDER
  });

  const relatedPdf = article?.articleDetails?.relatedPdf?.nodes?.[0] as PdfItem;
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl || '';

  const featuredImage = article?.featuredImage?.node;
  const mediumLarge = featuredImage?.mediaDetails?.sizes?.find(
    (size) => size?.name === 'medium_large'
  );

  const imageUrl = mediumLarge?.sourceUrl || featuredImage?.sourceUrl || '';

  useEffect(() => {
    if (imageUrl) {
      getImagePlaceholder(imageUrl).then(result => {
        if (result) {
          setImageWithPlaceholder({
            src: result.src,
            placeholder: result.placeholder || DEFAULT_PLACEHOLDER
          });
        }
      });
    }
  }, [imageUrl]);

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
              {article?.featuredImage?.node && (
                <Image
                  src={imageUrl}
                  alt={featuredImage?.altText || article.title || ''}
                  width={Number(mediumLarge?.width || featuredImage?.mediaDetails?.width || 0)}
                  height={Number(mediumLarge?.height || featuredImage?.mediaDetails?.height || 0)}
                  sizes="100vw"
                  priority={true}
                  quality={75}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL={imageWithPlaceholder.placeholder}
                  style={{ objectFit: 'contain' }}
                />
              )}
            </>
          )}

          {pdfUrl ? (
            <PdfViewerComponent pdfUrl={pdfUrl} />
          ) : (
            <div
              style={{
                fontFamily: 'Helvetica, sans-serif',
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#333',
              }}
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
