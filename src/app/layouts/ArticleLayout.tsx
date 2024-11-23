import React from 'react';
import BaseLayout from './BaseLayout';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '../components/VideoPlayer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import {
  GetGlobalSettingsQuery,
  GetArticleByUriQuery,
  PdfItem,
  AudioItem,
  TermNode,
  Article,
  JournalIssue,
  VideoItem
} from '@/gql/gql-generated';
import PdfViewerComponent from './PdfViewerComponent';

import { format } from 'date-fns';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PrintButton from '../components/PrintButton';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ArticleLayoutProps {
  article: GetArticleByUriQuery['article'];
  globalSettings: GetGlobalSettingsQuery['globalSettings'];
  slug: string;
}

const ArticleLayout = ({ article, globalSettings, slug }: ArticleLayoutProps) => {
  const relatedPdf = article?.articleDetails?.relatedPdf?.nodes?.[0] as PdfItem;
  const pdfUrl = relatedPdf?.pdfItemDetails?.pdfFile?.node?.mediaItemUrl || '';
  const featuredImage = article?.featuredImage?.node;
  const audio = article?.articleDetails?.relatedAudio?.nodes as
    | AudioItem[]
    | undefined;
  const terms = article?.terms?.nodes as TermNode[] | undefined;
  const { publicationDate, suppressDate, displayDate, source } =
    article?.articleDetails || {};
  const relatedJournalNode =
    article?.articleDetails?.relatedJournal?.nodes?.[0];
  let journalCoverImage = null;
  let articlesInJournal: Article[] | null = null;
  let journalSlug = '';
  let journalTitle = '';
  const relatedArticles = article?.articleDetails?.relatedArticle?.nodes as
    | Article[]
    | undefined;
  const relatedVideo = article?.articleDetails?.relatedVideo?.nodes?.[0] as VideoItem | undefined;
  const videoUrl = relatedVideo?.videoDetails?.videoEmbedCode || '';
  const videoCaption = relatedVideo?.videoDetails?.articlePageCaption || '';

  // Check if the node is of type JournalIssue and has a featuredImage
  if (relatedJournalNode?.__typename === 'JournalIssue') {
    if (relatedJournalNode.featuredImage?.node) {
      journalCoverImage = relatedJournalNode.featuredImage.node;
    }

    // Extract the articles in the journal issue
    articlesInJournal = relatedJournalNode.journalIssueDetails
      ?.articlesInJournal?.nodes as Article[] | null;
    journalSlug = relatedJournalNode.slug || '';
    journalTitle = (relatedJournalNode as JournalIssue).title || '';
  }

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

  let dateToDisplay: string | null = null;

  if (suppressDate) {
    if (displayDate) {
      // Use displayDate as is
      dateToDisplay = displayDate;
    } else {
      // If suppressDate is true but displayDate is not provided, you can choose to display nothing or handle it accordingly.
      dateToDisplay = null;
    }
  } else {
    if (publicationDate) {
      // Format the publicationDate
      dateToDisplay = format(new Date(publicationDate), 'd MMMM yyyy');
    } else {
      // If publicationDate is not provided, you can choose to display nothing or handle it accordingly.
      dateToDisplay = null;
    }
  }

  return (
    <BaseLayout
      globalSettings={globalSettings}
      slug={slug}
      leftSidebar={
        <div>
          {/* Link the cover image and title to the journal issue */}
          {journalCoverImage && (
            <Link href={`/journal/${journalSlug}`} passHref>
              <Image
                src={journalCoverImage.mediaItemUrl || ''}
                alt={
                  journalCoverImage.altText || journalTitle || 'Journal cover'
                }
                width={150}
                height={225}
                priority={true}
                quality={75}
                className="w-full h-auto mt-3"
                placeholder="blur"
                blurDataURL={journalCoverImage.thumbhash || fallbackSVG}
                style={{ maxWidth: '75%' }}
              />
            </Link>
          )}

          {/* Display the journal title below the image as a link */}
          {journalTitle && (
            <Link href={`/journal/${journalSlug}`} passHref>
              <span className="block mt-0 text-base font-semibold text-communist-red hover:underline">
                {journalTitle}
              </span>
            </Link>
          )}
          {/* Vertical Stepper for Articles in the Journal Issue */}
          {articlesInJournal && articlesInJournal.length > 0 && (
            <div className="mt-2">
              <h3 className="mb-2 mt-0 text-lg font-semibold">
                Articles in this Issue
              </h3>
              <ul className="list-none m-0 p-0">
                {articlesInJournal.map((issueArticle, index) => {
                  const isCurrentArticle = issueArticle.slug === article?.slug;
                  return (
                    <li key={issueArticle.id} className="mb-4 flex items-start">
                      {/* Marker and Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full mt-1 ${isCurrentArticle
                            ? 'bg-communist-red'
                            : 'bg-gray-300'
                            }`}
                        ></div>
                        {/* Line connecting to the next item */}
                        {index !== articlesInJournal.length - 1 && (
                          <div className="flex-1 w-px bg-gray-300"></div>
                        )}
                      </div>
                      {/* Title */}
                      <div className="ml-4">
                        {isCurrentArticle ? (
                          <span className="font-medium text-communist-red">
                            {issueArticle.title}
                          </span>
                        ) : (
                          <Link
                            href={`/article/${issueArticle.slug}`}
                            className="text-gray-800 hover:text-communist-red"
                          >
                            {issueArticle.title}
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
      }
      mainContent={
        <div className='relative'>
          {!pdfUrl && (
            <>
              <h1 className="mt-1 mb-0 text-gray-800">{article?.title}</h1>
              {article?.articleDetails?.subtitle && (
                <h2 className="mt-0 mb-1 text-gray-800">
                  {article.articleDetails.subtitle}
                </h2>
              )}
              {/* Display the date if available */}
              {dateToDisplay && (
                <p className="mt-1 mb-1 text-gray-800">{dateToDisplay}</p>
              )}
              {/* Display the source if available and suppressDate is false */}
              {source && (
                <p className="mt-1 mb-1 text-gray-800">Source: {source}</p>
              )}

              {/* Display the video if it exists, else display the featured image */}
              {/* Use the VideoPlayer component */}
              {videoUrl ? (
                <div className='print:hidden'>
                  <VideoPlayer
                    url={videoUrl}
                    caption={videoCaption}
                  />
                </div>
              ) : (
                featuredImage && (
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
                    style={{
                      maxWidth: '100%',
                    }}
                  />
                )
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
          {/* Render audio player(s) if audio exists */}

          {audio && audio.length > 0 && (
            <div className="mt-4 print:hidden">
              <h3 className="mb-2 mt-0">Related Audio</h3>
              {audio.map((item, index) => (
                <div key={item.id} id={`audio-track-${index + 1}`} className="mt-2 mb-4">
                  {item.title && <h4>{item.title}</h4>}
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
          {/* Scroll-to-Top Button */}
          <ScrollToTopButton />

        </div>
      }
      rightSidebar={
        <div className="pt-2">
          {terms && terms.length > 0 && (
            <div>
              <h3 className="mb-0 mt-0">Related Topics</h3>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
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
            <div className="mt-0 mb-4">
              <h3 className="mb-0 mt-0">Related Audio</h3>
              <div className="mt-1">
                {audio.map((item, index) => (
                  <div key={item.id} className="flex items-center mb-2">
                    <Link
                      href={`#audio-track-${index + 1}`}  // Ensure this matches the ID in the main content
                      className="text-communist-red hover:underline"
                    >
                      Here
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-0">
            <h3 className="mb-0 mt-0">Share This Article</h3>
            <div className="flex justify-start items-center gap-x-5 mt-1 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon
                  className="fill-communist-red"
                  style={{ fontSize: '2rem' }}
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon
                  className="fill-communist-red"
                  style={{ fontSize: '2rem' }}
                />
              </a>
              <a href="mailto:?subject=Check%20out%20this%20article">
                <EmailIcon
                  className="fill-communist-red"
                  style={{ fontSize: '2rem' }}
                />
              </a>
              <PrintButton />
            </div>
          </div>
          {/* Display Related Articles if available */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-0">
              <h3 className="mb-1 mt-0">Related Articles</h3>
              <div className="mt-0 mb-4">
                {relatedArticles.map((relatedArticle) => {
                  const slug = relatedArticle.slug;
                  return (
                    <div key={relatedArticle.id} className="mb-1">
                      {slug ? (
                        <Link
                          href={`/article/${slug}`}
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
        </div>
      }

    />
  );
};

export default ArticleLayout;
