import { GetJournalByUriQuery, useGetJournalByUriQuery, GetGlobalSettingsQuery, useGetGlobalSettingsQuery } from '../../../gql/gql-generated';
import { serverFetch } from '../../../gql/query-utils';

import React from 'react';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';
import Image from "next/legacy/image";
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

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 25%', marginRight: '20px' }}>
          <Image
            src={imageUrl}
            alt={title || 'Journal cover'}
            width={300}
            height={450}
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          />
        </div>
        <div style={{ flex: '1' }}>
          <h1 style={{ margin: '0 0 20px', fontSize: '2rem', fontWeight: 'bold' }}>{title}</h1>
          {journalIssueDetails?.articlesInJournal?.nodes?.map((node, index) => {
            const article = node as ArticleNode;
            if (article.articleDetails) {
              const articleTitle = article.articleDetails.tableOfContentsTitle || article.title;
              return (
                <div key={index} className='mb-2'>
                  <Link href={`/article/${article.slug}`} passHref>
                    <span className='text-communist-red text-xl font-Helvetica'>{articleTitle}</span>
                  </Link>
                </div>
              );
            }
            return null;
          }).filter(Boolean) ?? <p>No articles found.</p>}
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
}
