// src\app\[lang]\layouts\ArticleLayout.tsx
import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ShareButton from '../components/ShareButton';
import {
  GetGlobalSettingsQuery,
  GetArticleByUriQuery,
  PdfItem,
  AudioItem,
  Book,
  TermNode,
  Article,
  JournalIssue,
  VideoItem,
} from '@/gql/gql-generated';
import { format } from 'date-fns';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false,
});
const PdfViewerComponent = dynamic(() => import('./PdfViewerComponent'), {
  ssr: false,
});

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: GetArticleByUriQuery['article'];
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
  slug: string;
  context?: string;
  lang: string;
}

const ArticleLayout = ({
  article,
  globalSettings,
  slug,
  context,
  lang,
}: ArticleLayoutProps) => {
  const relatedPdfNode = article?.articleDetails?.relatedPdf?.nodes?.[0];
  const relatedPdf =
    relatedPdfNode?.__typename === 'PdfItem' ? relatedPdfNode : undefined;
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl || '';
  const featuredImage = article?.featuredImage?.node;
  const audioNodes = article?.articleDetails?.relatedAudio?.nodes;
  const audio = audioNodes?.filter((node) => node.__typename === 'AudioItem');
  const terms = article?.terms?.nodes as TermNode[] | undefined;
  const { publicationDate, suppressDate, displayDate, source } =
    article?.articleDetails || {};
  const relatedJournalNode =
    article?.articleDetails?.relatedJournal?.nodes?.[0];

  const relatedBook = article?.articleDetails?.relatedBook?.nodes?.[0] as Book;
  const bookCoverImage = relatedBook?.featuredImage?.node;
  const bookSlug = relatedBook?.slug || '';
  const bookTitle = relatedBook?.title || '';

  let articlesInBook: Article[] | null = null;
  if (relatedBook?.bookDetails?.relatedArticles?.nodes) {
    articlesInBook = relatedBook.bookDetails.relatedArticles.nodes as Article[];
  }

  const getBookNavigation = () => {
    if (!articlesInBook || !article?.slug) return { prev: null, next: null };
    const currentIndex = articlesInBook.findIndex(
      (bookArticle) => bookArticle.slug === article.slug
    );

    return {
      prev: currentIndex > 0 ? articlesInBook[currentIndex - 1] : null,
      next:
        currentIndex < articlesInBook.length - 1
          ? articlesInBook[currentIndex + 1]
          : null,
    };
  };

  const { prev, next } = getBookNavigation();

  let journalCoverImage = null;
  let articlesInJournal = null;
  let journalSlug = '';
  let journalTitle = '';
  const relatedArticles = article?.articleDetails?.relatedArticle?.nodes as
    | Article[]
    | undefined;
  const relatedVideo = article?.articleDetails?.relatedVideo?.nodes?.[0] as
    | VideoItem
    | undefined;
  const videoUrl = relatedVideo?.videoDetails?.videoEmbedCode || '';
  const videoCaption = relatedVideo?.videoDetails?.articlePageCaption || '';

  if (relatedJournalNode?.__typename === 'JournalIssue') {
    if (relatedJournalNode.featuredImage?.node) {
      journalCoverImage = relatedJournalNode.featuredImage.node;
    }

    // Don't cast - just use the data as-is
    articlesInJournal =
      relatedJournalNode.journalIssueDetails?.articlesInJournal?.nodes || null;

    journalSlug = relatedJournalNode.slug || '';
    journalTitle = relatedJournalNode.title || '';
  }

  const fallbackSVG = `data:image/svg+xml;base64,${Buffer.from(
    `
    <svg width="768" height="131" viewBox="0 0 768 131" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="768" height="131" fill="#4B5563"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
       fill="#9CA3AF" font-family="system-ui" font-size="16">
        Image Not Found
      </text>
    </svg>
    `
  ).toString('base64')}`;

  let dateToDisplay: string | null = null;
  if (suppressDate) {
    dateToDisplay = displayDate || null;
  } else if (publicationDate) {
    dateToDisplay = format(new Date(publicationDate), 'd MMMM yyyy');
  }

  const leftSidebarContent =
    context === 'book' ? (
      <div>
        <h3 className="mb-2 mt-0 text-lg font-semibold">From the Book</h3>
        {bookCoverImage && (
          <Link href={`/${lang}/book/${bookSlug}`} passHref>
            <Image
              src={bookCoverImage.mediaItemUrl || ''}
              alt={bookCoverImage.altText || bookTitle || 'Book cover'}
              width={150}
              height={225}
              priority={true}
              quality={75}
              className="w-full h-auto mt-3"
              placeholder="blur"
              blurDataURL={bookCoverImage.thumbhash || fallbackSVG}
              style={{ maxWidth: '60%' }}
            />
          </Link>
        )}
        {bookTitle && (
          <Link href={`/${lang}/book/${bookSlug}`} passHref>
            <span className="block mt-2 text-base font-semibold text-communist-red hover:underline">
              {bookTitle}
            </span>
          </Link>
        )}
        {articlesInBook && articlesInBook.length > 0 && (
          <div className="mt-2">
            <h3 className="mb-2 mt-0 text-lg font-semibold">
              Articles in this Book
            </h3>
            <ul className="list-none m-0 p-0">
              {articlesInBook.map((bookArticle, index) => {
                const isCurrentArticle = bookArticle.slug === article?.slug;
                const sidebarTitle =
                  bookArticle.articleDetails?.tableOfContentsTitle?.trim() ||
                  bookArticle.title;

                return (
                  <li key={bookArticle.id} className="mb-4 flex items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          isCurrentArticle ? 'bg-communist-red' : 'bg-gray-300'
                        }`}
                      ></div>
                      {index !== articlesInBook.length - 1 && (
                        <div className="flex-1 w-px bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      {isCurrentArticle ? (
                        <span className="font-medium text-communist-red">
                          {sidebarTitle}
                        </span>
                      ) : (
                        <Link
                          href={{
                            pathname: `/${lang}/article/${bookArticle.slug}`,
                            query: { context: 'book' },
                          }}
                          className="text-gray-800 hover:text-communist-red"
                        >
                          {sidebarTitle}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div>
        {journalCoverImage && (
          <Link href={`/${lang}/journal/${journalSlug}`} passHref>
            <Image
              src={journalCoverImage.mediaItemUrl || ''}
              alt={journalCoverImage.altText || journalTitle || 'Journal cover'}
              width={150}
              height={225}
              priority={true}
              quality={75}
              className="w-full h-auto mt-3"
              placeholder="blur"
              blurDataURL={journalCoverImage.thumbhash || fallbackSVG}
              style={{ maxWidth: '60%' }}
            />
          </Link>
        )}
        {journalTitle && (
          <Link href={`/${lang}/journal/${journalSlug}`} passHref>
            <span className="block mt-0 text-base font-semibold text-communist-red hover:underline">
              {journalTitle}
            </span>
          </Link>
        )}
        {articlesInJournal && articlesInJournal.length > 0 && (
          <div className="mt-2">
            <h3 className="mb-2 mt-0 text-lg font-semibold">
              Articles in this Issue
            </h3>
            <ul className="list-none m-0 p-0">
              {articlesInJournal.map((issueArticle, index) => {
                // Check if it's actually an Article
                if (issueArticle.__typename !== 'Article') return null;

                const isCurrentArticle = issueArticle.slug === article?.slug;
                const sidebarTitle =
                  issueArticle.articleDetails?.tableOfContentsTitle?.trim() ||
                  issueArticle.title;

                return (
                  <li key={issueArticle.id} className="mb-4 flex items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 ${
                          isCurrentArticle ? 'bg-communist-red' : 'bg-gray-300'
                        }`}
                      ></div>
                      {index !== articlesInJournal.length - 1 && (
                        <div className="flex-1 w-px bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      {isCurrentArticle ? (
                        <span className="font-medium text-communist-red">
                          {sidebarTitle}
                        </span>
                      ) : (
                        <Link
                          href={`/${lang}/article/${issueArticle.slug}`}
                          className="text-gray-800 hover:text-communist-red"
                        >
                          {sidebarTitle}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );

  return (
    <BaseLayout
      globalSettings={globalSettings}
      slug={slug}
      lang={lang}
      leftSidebar={leftSidebarContent}
      mainContent={
        <div className="relative">
          {/* Share button at top for PDFs */}
          {pdfUrl && (
            <div className="hidden md:flex justify-end mt-1 mb-4">
              <ShareButton />
            </div>
          )}
          {/* Title and metadata section - only show for non-PDF */}
          {!pdfUrl && (
            <>
              <h1 className="mt-1 mb-0 text-gray-800">{article?.title}</h1>
              {article?.articleDetails?.subtitle && (
                <h2 className="mt-0 mb-1 text-gray-800">
                  {article.articleDetails.subtitle}
                </h2>
              )}
              {dateToDisplay && (
                <div className="flex items-center justify-between mt-1 mb-1 text-gray-800">
                  <span>
                    {dateToDisplay}
                    {context === 'book' ? (
                      <>
                        {bookTitle && (
                          <>
                            {' '}
                            |{' '}
                            <Link
                              href={`/${lang}/book/${bookSlug}`}
                              className="text-communist-red hover:underline"
                            >
                              {bookTitle}
                            </Link>
                          </>
                        )}
                        {journalTitle && (
                          <>
                            {' '}
                            |{' '}
                            <Link
                              href={`/${lang}/journal/${journalSlug}`}
                              className="text-communist-red hover:underline"
                            >
                              {journalTitle}
                            </Link>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {journalTitle && (
                          <>
                            {' '}
                            |{' '}
                            <Link
                              href={`/${lang}/journal/${journalSlug}`}
                              className="text-communist-red hover:underline"
                            >
                              {journalTitle}
                            </Link>
                          </>
                        )}
                        {bookTitle && (
                          <>
                            {' '}
                            |{' '}
                            <Link
                              href={`/${lang}/book/${bookSlug}`}
                              className="text-communist-red hover:underline"
                            >
                              {bookTitle}
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </span>
                  <ShareButton />
                </div>
              )}

              {source && (
                <p className="mt-1 mb-1 text-gray-800">Source: {source}</p>
              )}

              {videoUrl ? (
                <div className="print:hidden mt-3">
                  <VideoPlayer url={videoUrl} caption={videoCaption} />
                </div>
              ) : (
                featuredImage && (
                  <div>
                    <Image
                      src={featuredImage.sourceUrl || ''}
                      alt={featuredImage.altText || article.title || ''}
                      width={Number(featuredImage.mediaDetails?.width || 0)}
                      height={Number(featuredImage.mediaDetails?.height || 0)}
                      priority={true}
                      quality={75}
                      className="w-full h-auto mt-2 print:hidden"
                      placeholder="blur"
                      blurDataURL={featuredImage.thumbhash || fallbackSVG}
                      sizes="(max-width: 1050px) 100vw, 780px"
                      style={{ maxWidth: '100%' }}
                    />
                    {featuredImage.caption && (
                      <div
                        className="text-sm text-gray-600 mt-1 italic"
                        dangerouslySetInnerHTML={{
                          __html: featuredImage.caption,
                        }}
                      />
                    )}
                  </div>
                )
              )}

              {audio && audio.length > 0 && (
                <div className="mt-4 print:hidden">
                  {audio.map((item, index) => (
                    <div
                      key={item.id}
                      id={`audio-track-${index + 1}`}
                      className="mt-2 mb-4"
                    >
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
            </>
          )}

          {/* Main content - either PDF or article content */}
          {pdfUrl ? (
            <>
              <PdfViewerComponent pdfUrl={pdfUrl} />
            </>
          ) : (
            <>
              <div
                className="font-helvetica text-lg leading-normal text-gray-800"
                dangerouslySetInnerHTML={{ __html: article?.content || '' }}
              />

              {/* 
                Minimal change here: 
                Wrap each term in a Link that navigates to either /place/[slug] or /topic/[slug] 
                depending on the term.taxonomyName.
              */}
              {terms && terms.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {terms.map((term) => {
                      // Decide if it's a place or a topic:
                      const url =
                        term.taxonomyName === 'place'
                          ? `/${lang}/place/${term.slug}`
                          : `/${lang}/topic/${term.slug}`;

                      return (
                        <Link
                          key={term.id}
                          href={url}
                          className="bg-communist-red text-custom-bg text-sm font-normal px-2.5 py-0.5 rounded tracking-widest hover:opacity-90"
                        >
                          {term.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {relatedArticles && relatedArticles.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-1 mt-0">Related Articles</h3>
                  <div className="mt-0 mb-4">
                    {relatedArticles.map((relatedArticle) => {
                      const slug = relatedArticle.slug;
                      return (
                        <div key={relatedArticle.id} className="mb-1">
                          {slug ? (
                            <Link
                              href={`/${lang}/article/${slug}`}
                              className="text-communist-red hover:underline"
                            >
                              {relatedArticle.title || slug}
                            </Link>
                          ) : (
                            <span>
                              {relatedArticle.title || 'No slug available'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Book navigation - show for both PDF and regular articles */}
          {context === 'book' && (
            <div className="border-t border-gray-200 mt-6">
              <div className="flex justify-between items-center text-lg space-x-6 sm:space-x-12">
                {prev ? (
                  <Link
                    href={{
                      pathname: `/${lang}/article/${prev.slug}`,
                      query: { context: 'book' },
                    }}
                    className="flex items-center text-communist-red hover:underline font-semibold text-lg max-w-[calc(50%-1.5rem)] sm:max-w-[calc(50%-3rem)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Previous:{' '}
                      {prev.articleDetails?.tableOfContentsTitle?.trim() ||
                        prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {next ? (
                  <Link
                    href={{
                      pathname: `/${lang}/article/${next.slug}`,
                      query: { context: 'book' },
                    }}
                    className="flex items-center text-communist-red hover:underline font-semibold text-lg max-w-[calc(50%-1.5rem)] sm:max-w-[calc(50%-3rem)]"
                  >
                    <span>
                      Next:{' '}
                      {next.articleDetails?.tableOfContentsTitle?.trim() ||
                        next.title}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 ml-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-start mt-6 mb-6">
            <ShareButton />
          </div>

          <ScrollToTopButton />
        </div>
      }
      rightSidebar={null}
    />
  );
};

export default ArticleLayout;
