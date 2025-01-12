// app/topic/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import {
  GetArticlesByTopicSlugQuery,
  useGetArticlesByTopicSlugQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '../../../gql/gql-generated';
import { serverFetch } from '../../../gql/query-utils';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1) Fetch the topic data by slug
  const topicData: GetArticlesByTopicSlugQuery = await serverFetch(
    useGetArticlesByTopicSlugQuery,
    {
      variables: { slug }, // (id: $slug, taxonomy: TOPIC, idType: SLUG)
      next: { revalidate: 60 },
    }
  );

  // 2) Fetch global settings for layout
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    {
      next: { revalidate: 60 },
    }
  );

  const globalSettings = globalSettingsData.globalSettings;
  const { termNode } = topicData;

  // 3) Validate we got a termNode
  if (!termNode) {
    return <div>Topic not found.</div>;
  }

  // 4) If your schema defines termNode as a union, TypeScript wants a type guard:
  if (termNode.__typename !== 'Topic') {
    return <div>Not a Topic. (Unexpected type: {termNode.__typename})</div>;
  }

  // 5) Now we’re guaranteed `termNode` is a Topic
  const topicName = termNode.name || 'Untitled Topic';
  const articles = termNode.contentNodes?.nodes || [];

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div className="w-full">
        <h2 className="font-cambay text-communist-red text-3xl mb-3 mt-0">
          {topicName}
        </h2>

        {articles.length > 0 ? (
          articles.map((article, idx) => {
            // "article" is typed per codegen (e.g., { __typename: 'Article', articleDetails, ... })
            if (article.__typename !== 'Article') {
              // If there's a small chance the array can contain other node types
              return null;
            }

            const displayedTitle =
              article.articleDetails?.tableOfContentsTitle || article.title;

            if (!displayedTitle || !article.slug) return null;

            return (
              <div key={idx} className="mb-1.5 last:mb-0">
                <Link
                  href={`/article/${article.slug}`}
                  className="font-helvetica text-xl text-gray-700 hover:text-communist-red transition-colors"
                >
                  {displayedTitle}
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No articles found.</p>
        )}
      </div>
    </BaseLayoutNoSideBars>
  );
}
