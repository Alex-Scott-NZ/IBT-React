import React from 'react';
import BaseLayoutNoSideBars from '../layouts/BaseLayoutNoSideBars';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../utils/imageHelpers';
import {
  GetJournalIssuesQuery,
  useGetJournalIssuesQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
  FragmentFeaturedImageFragment,
} from '../../gql/gql-generated';
import { serverFetch } from '../../gql/query-utils';

export const revalidate = 60;

type ArticleNode = {
  __typename?: 'Article';
  title?: string | null;
  slug?: string | null;
  id?: string;
  articleDetails?: {
    tableOfContentsTitle?: string | null;
  } | null;
};

const JournalPage = async () => {
  const journalIssuesData: GetJournalIssuesQuery = await serverFetch(
    useGetJournalIssuesQuery
  );
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery
  );

  const journalIssues = journalIssuesData.journalIssues?.nodes || [];
  const globalSettings = globalSettingsData.globalSettings;

  const orderedJournalIssues = [...journalIssues].sort((a, b) =>
    (b.slug || '').localeCompare(a.slug || '')
  );

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div className="container">
        <h2 className="font-cambay text-communist-red text-3xl mb-4 mt-2">
          All Journal Issues
        </h2>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {orderedJournalIssues.map((issue) => {
            const featuredImage: FragmentFeaturedImageFragment | null =
              issue.featuredImage?.node || null;
            return (
              <div
                key={issue.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Link href={`/journal/${issue.slug}`} className="block">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={
                        featuredImage
                          ? getImageUrl(featuredImage, 440)
                          : '/placeholder-image.jpg'
                      }
                      alt={
                        featuredImage?.altText || issue.title || 'Journal cover'
                      }
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={
                        featuredImage?.thumbhash ||
                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIB4gHh4dIB0gHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
                      }
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <h2 className="font-cambay text-xl mb-4">{issue.title}</h2>

                  <ul className="space-y-2">
                    {issue.journalIssueDetails?.articlesInJournal?.nodes
                      ?.length ? (
                      issue.journalIssueDetails.articlesInJournal.nodes
                        .map((node, index) => {
                          const article = node as ArticleNode;
                          if (article.__typename === 'Article') {
                            return (
                              <li key={article.id || article.slug || index}>
                                <Link
                                  href={`/article/${article.slug}`}
                                  className="font-helvetica text-gray-700 hover:text-communist-red transition-colors"
                                >
                                  {article.articleDetails
                                    ?.tableOfContentsTitle || article.title}
                                </Link>
                              </li>
                            );
                          }
                          return null;
                        })
                        .filter(Boolean)
                    ) : (
                      <li className="font-helvetica text-gray-500">
                        No articles available
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
};

export default JournalPage;
