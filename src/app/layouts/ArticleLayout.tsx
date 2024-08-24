"use client";

import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import { DetailedArticle, GlobalSettingsData } from '../types/Article';

import { Worker, Viewer,  ViewMode, ScrollMode } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: DetailedArticle;
  globalSettings: GlobalSettingsData | null;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article, globalSettings }) => {
  const relatedPdf = article.articleDetails?.relatedPdf?.nodes?.[0];
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl;

  const toolbarPluginInstance = toolbarPlugin({
    fullScreenPlugin: {
      getFullScreenTarget: (pagesContainer: HTMLElement): HTMLElement => {
        const container = pagesContainer.closest('.js-viewer-container');
        return container instanceof HTMLElement ? container : pagesContainer;
      },
      renderExitFullScreenButton: () => <></>,
    },
  });
  const { Toolbar } = toolbarPluginInstance;

  return (
    <BaseLayout
      globalSettings={globalSettings}
      leftSidebar={<div>Article Left Sidebar</div>}
      mainContent={
        <div>
          {!pdfUrl && (
            <>
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
            </>
          )}

          {pdfUrl ? (
            <>
              <style>{`
      .rpv-full-screen__overlay {
        display: none;
      }
    `}</style>
              <div
                className="js-viewer-container"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '850px',
                  position: 'relative',
                  marginBottom: '50px',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '0.25rem',
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1,
                    borderRadius: '2px',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Toolbar>
                    {({
                      ZoomOut,
                      ZoomIn,
                      GoToPreviousPage,
                      GoToNextPage,
                      CurrentPageInput,
                      NumberOfPages,
                      EnterFullScreen,
                      Download,
                      Print,
                    }: ToolbarSlot) => (
                      <>
                        <ZoomOut />
                        <ZoomIn />
                        <GoToPreviousPage />
                        <CurrentPageInput /> / <NumberOfPages />
                        <GoToNextPage />
                        <EnterFullScreen />
                        <Download />
                        <Print />
                      </>
                    )}
                  </Toolbar>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={pdfUrl}
                      plugins={[toolbarPluginInstance]}
                      viewMode={ViewMode.SinglePage}
                      scrollMode={ScrollMode.Page}
                    />
                  </Worker>
                </div>
              </div>
            </>
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
