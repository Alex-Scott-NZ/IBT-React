import {
  BookByUriQuery,
  useBookByUriQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '../../../gql/gql-generated';
import { serverFetch } from '../../../gql/query-utils';

import React from 'react';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';
import Image from 'next/image';
import Link from 'next/link';

// Define a type for the possible node types
type ArticleNode = {
  title?: string | null;
  uri?: string | null;
  slug?: string | null;
  articleDetails?: {
    tableOfContentsTitle?: string | null;
  } | null;
};

export default async function BookPage({
  params,
}: {
  params: { slug: string };
}) {
  const uri = `/book/${params.slug}`;

  const bookData: BookByUriQuery = await serverFetch(useBookByUriQuery, {
    variables: { uri },
    next: { revalidate: 60 },
  });
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  const book = bookData.bookBy;
  const globalSettings = globalSettingsData.globalSettings;

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
  

  if (!book) {
    return <div>Book not found</div>;
  }

  const { title, bookDetails, featuredImage } = book;
  const imageUrl = featuredImage?.node?.mediaItemUrl || '';

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 25%', marginRight: '20px' }}>
          <Image
            src={imageUrl}
            alt={title || 'Book cover'}
            width={300}
            height={450}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
              maxWidth: '100%'
            }}
            placeholder='blur'
            blurDataURL={featuredImage?.node?.thumbhash || fallbackSVG}
          />
        </div>
        <div style={{ flex: '1' }}>
          <h1
            style={{ margin: '0 0 20px', fontSize: '2rem', fontWeight: 'bold' }}
          >
            {title}
          </h1>
          {bookDetails?.subheading && (
            <h2 style={{ margin: '0 0 20px', fontSize: '1.5rem' }}>
              {bookDetails.subheading}
            </h2>
          )}
          {bookDetails?.summary && (
            <p style={{ margin: '0 0 20px' }}>{bookDetails.summary}</p>
          )}
          <h3 style={{ margin: '20px 0', fontSize: '1.2rem' }}>
            Related Articles:
          </h3>
          {bookDetails?.relatedArticles?.nodes
            ?.map((node, index) => {
              const article = node as ArticleNode;
              if (article) {
                const articleTitle =
                  article.articleDetails?.tableOfContentsTitle || article.title;
                return (
                  <div key={index} className="mb-2">
                    <Link href={`/article/${article.slug}`} passHref>
                      <span className="text-communist-red text-xl font-Helvetica">
                        {articleTitle}
                      </span>
                    </Link>
                  </div>
                );
              }
              return null;
            })
            .filter(Boolean) ?? <p>No related articles found.</p>}
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
}
