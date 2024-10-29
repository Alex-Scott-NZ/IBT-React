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

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div className="container">
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
                blurDataURL={
                  featuredImage?.node.thumbhash ||
                  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4gHh4dIB0gHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
                }
              />
            </div>
          </div>

          {/* Right column with title and articles */}
          <div className="md:col-span-2">
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

