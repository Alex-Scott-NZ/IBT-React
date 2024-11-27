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
    useGetJournalIssuesQuery, {next: {revalidate:60}}
  );
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery, {next: {revalidate:60}}
  );

  const journalIssues = journalIssuesData.journalIssues?.nodes || [];
  const globalSettings = globalSettingsData.globalSettings;

  const orderedJournalIssues = [...journalIssues].sort((a, b) =>
    (b.slug || '').localeCompare(a.slug || '')
  );

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
                      src={featuredImage?.mediaItemUrl || fallbackSVG}
                      alt={
                        featuredImage?.altText || issue.title || 'Journal cover'
                      }
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={featuredImage?.thumbhash || fallbackSVG}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      quality={75}
                      loading="lazy"
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
                                  className="font-helvetica text-gray-900 hover:text-communist-red transition-colors"
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
