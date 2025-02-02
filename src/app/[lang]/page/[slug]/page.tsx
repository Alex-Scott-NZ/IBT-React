import {
  GetPageByUriQuery,
  useGetPageByUriQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '../../../../gql/gql-generated';
import { serverFetch } from '../../../../gql/query-utils';

import React from 'react';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';

export default async function Page({
  params,
}: {
  params: { 
    slug: string;
    lang: string; // Add lang parameter
  };
}) {
  // Construct the URI for the page, including language
  const uri = `/${params.lang}/${params.slug}`;

  // Fetch the page data
  const pageData: GetPageByUriQuery = await serverFetch(useGetPageByUriQuery, {
    variables: { uri },
    next: { revalidate: 60 },
  });

  // Fetch global settings
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  const page = pageData.pageBy;
  const globalSettings = globalSettingsData.globalSettings;

  // Fallback for missing data
  if (!page) {
    return <div>Page not found</div>;
  }

  const { title, content } = page;

  return (
    <BaseLayoutNoSideBars 
      globalSettings={globalSettings}
      lang={params.lang} // Pass lang to BaseLayout
    >
      <div>
        <h2 className="font-cambay text-communist-red text-3xl mb-4 mt-2">
          {title}
        </h2>
        <div
          dangerouslySetInnerHTML={{
            __html: content || 'No content available.',
          }}
        />
      </div>
    </BaseLayoutNoSideBars>
  );
}