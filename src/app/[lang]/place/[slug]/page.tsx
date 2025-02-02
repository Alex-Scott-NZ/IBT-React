// app/place/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';

import {
  useGetArticlesByPlaceSlugQuery,
  GetArticlesByPlaceSlugQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '../../../../gql/gql-generated';

import { serverFetch } from '../../../../gql/query-utils';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. Fetch place data
  const placeData: GetArticlesByPlaceSlugQuery = await serverFetch(
    useGetArticlesByPlaceSlugQuery,
    {
      variables: { slug },
      next: { revalidate: 60 },
    }
  );

  // 2. Fetch global settings for layout
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    {
      next: { revalidate: 60 },
    }
  );

  const globalSettings = globalSettingsData.globalSettings;
  const { termNode } = placeData;

  if (!termNode) {
    return <div>Place not found.</div>;
  }

  // 3. If your schema still allows multiple termNode types, type guard for "Place"
  if (termNode.__typename !== 'Place') {
    return <div>Not a Place. (Unexpected type: {termNode.__typename})</div>;
  }

  const placeName = termNode.name || 'Unknown Place';
  const articleNodes = termNode.contentNodes?.nodes || [];

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div className="w-full">
        <h2 className="font-cambay text-communist-red text-3xl mb-3 mt-0">
          {placeName}
        </h2>

        {articleNodes.length > 0 ? (
          articleNodes.map((node, idx) => {
            // If codegen allows multiple node types, also check for Article
            if (node.__typename !== 'Article') return null;

            const displayedTitle = node.articleDetails?.tableOfContentsTitle || node.title;
            if (!displayedTitle || !node.slug) return null;

            return (
              <div key={idx} className="mb-1.5 last:mb-0">
                <Link
                  href={`/article/${node.slug}`}
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
