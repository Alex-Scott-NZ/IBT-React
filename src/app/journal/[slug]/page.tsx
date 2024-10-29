import { GetJournalByUriQuery, useGetJournalByUriQuery, GetGlobalSettingsQuery, useGetGlobalSettingsQuery } from '../../../gql/gql-generated';
import { serverFetch } from '../../../gql/query-utils';

import React from 'react';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';
import Image from "next/image";
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

export default async function JournalPage({ params }: { params: { slug: string } }) {
  const uri = `/journal/${params.slug}`;

  const journalData: GetJournalByUriQuery = await serverFetch(useGetJournalByUriQuery, { variables: { uri } });
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(useGetGlobalSettingsQuery);

  const journal = journalData.journalIssueBy;
  const globalSettings = globalSettingsData.globalSettings;

  if (!journal) {
    return <div>Journal not found</div>;
  }

  const { title, journalIssueDetails, featuredImage } = journal;
  const imageUrl = featuredImage?.node?.mediaItemUrl || '';

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
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left column with image */}
          <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={imageUrl}
              alt={title || 'Journal cover'}
              fill
              className="object-cover rounded-lg shadow-md"
              placeholder='blur'
              blurDataURL={featuredImage?.node.thumbhash || fallbackSVG}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              quality={75}
              priority // Since this is the main image, we might want to load it early
            />
          </div>
          </div>

          {/* Right column with title and articles */}
          <div className="md:col-span-3">
            <h2 className="font-cambay text-communist-red text-3xl mb-4 mt-2">{title}</h2>
            
            <div className="space-y-4">
              {journalIssueDetails?.articlesInJournal?.nodes?.map((node, index) => {
                const article = node as ArticleNode;
                if (article.articleDetails) {
                  const articleTitle = article.articleDetails.tableOfContentsTitle || article.title;
                  return (
                    <div key={index}>
                      <Link 
                        href={`/article/${article.slug}`}
                        className="font-helvetica text-xl text-gray-700 hover:text-communist-red transition-colors"
                      >
                        {articleTitle}
                      </Link>
                    </div>
                  );
                }
                return null;
              }).filter(Boolean) ?? <p className="text-gray-500">No articles found.</p>}
            </div>
          </div>
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
}

