import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import {
  GetGlobalSettingsQuery,
  GetArticleByUriQuery,
  PdfItem,
  AudioItem,
  TermNode,
} from '@/gql/gql-generated';
import PdfViewerComponent from './PdfViewerComponent';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PrintButton from '../components/PrintButton';

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
  const audio = article?.articleDetails?.relatedAudio?.nodes as AudioItem[] | undefined;
  const terms = article?.terms?.nodes as TermNode[] | undefined;

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
                  blurDataURL={featuredImage.thumbhash || fallbackSVG}
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
      rightSidebar={
        <div>
          {terms && terms.length > 0 && (
            <div>
              <h3 className="mb-0">Related Topics</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {terms.map((term) => (
                  <span
                    key={term.id}
                    className="bg-communist-red text-custom-bg text-sm font-normal px-2.5 py-0.5 rounded tracking-widest"
                  >
                    {term.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {audio && audio.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-0">Related Audio</h3>
              {audio.map((item) => (
                <div key={item.id} className="mt-2">
                  {item.audioItemDetails?.audioEmbedCode && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.audioItemDetails.audioEmbedCode,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <h3 className="mb-0">Share This Article</h3>
            <div className="flex justify-start items-center gap-x-6 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="fill-communist-red" style={{ fontSize: '2rem' }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="fill-communist-red" style={{ fontSize: '2rem' }} />
              </a>
              <a href="mailto:?subject=Check%20out%20this%20article">
                <EmailIcon className="fill-communist-red" style={{ fontSize: '2rem' }} />
              </a>
              <PrintButton />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ArticleLayout;
