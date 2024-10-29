import React from 'react';
import BaseLayout from './BaseLayout';
import Image from "next/image";
import { GetGlobalSettingsQuery, GetArticleByUriQuery, PdfItem } from '@/gql/gql-generated';
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

const ArticleLayout = ({ article, globalSettings }: ArticleLayoutProps) => {
  
  const relatedPdf = article?.articleDetails?.relatedPdf?.nodes?.[0] as PdfItem;
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl || '';

  const featuredImage = article?.featuredImage?.node;
  const mediumLarge = featuredImage?.mediaDetails?.sizes?.find(
    (size) => size?.name === 'medium_large'
  );

  const imageUrl = mediumLarge?.sourceUrl || featuredImage?.sourceUrl || '';

  return (
    (<BaseLayout
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
                  priority={true}
                  quality={75}
                  className="w-full h-auto"
                  placeholder="blur"
                  blurDataURL={featuredImage?.thumbhash || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4gHh4dIB0gHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='}
                  sizes="100vw"
                  style={{
                    objectFit: 'contain',
                    maxWidth: "100%",
                    height: "auto"
                  }} />
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
    />)
  );
};

export default ArticleLayout;
