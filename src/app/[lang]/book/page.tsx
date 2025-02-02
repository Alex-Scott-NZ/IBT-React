import React from 'react';
import BaseLayoutNoSideBars from '../layouts/BaseLayoutNoSideBars';
import Link from 'next/link';
import Image from 'next/image';
import {
  GetBooksQuery,
  useGetBooksQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '@/gql/gql-generated';
import { serverFetch } from '@/gql/query-utils';

export default async function Page({
  params,
}: {
  params: { lang: string };
}) {
  const booksData: GetBooksQuery = await serverFetch(useGetBooksQuery, {
    next: { revalidate: 60 },
  });
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  const books = booksData.books?.nodes || [];
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

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings} lang={params.lang}>
      <div className="w-full">
        <h1 className="font-cambay text-communist-red text-3xl mb-4 mt-2">
          All Books
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/${params.lang}/book/${book.slug}`} className="block">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={book.featuredImage?.node?.sourceUrl || fallbackSVG}
                    alt={
                      book.featuredImage?.node?.altText ||
                      book.title ||
                      'Book cover'
                    }
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={
                      book.featuredImage?.node?.thumbhash || fallbackSVG
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    quality={75}
                    loading="lazy"
                  />
                </div>
              </Link>

              <div className="p-4">
                <h2 className="font-cambay text-xl mb-2 text-communist-red hover:text-communist-red-dark">
                  <Link href={`/${params.lang}/book/${book.slug}`}>{book.title}</Link>
                </h2>
                {book.bookDetails?.subheading && (
                  <p className="font-helvetica text-gray-700 text-sm mb-2">
                    {book.bookDetails.subheading}
                  </p>
                )}
                {book.bookDetails?.summary && (
                  <p className="font-helvetica text-gray-600 text-sm line-clamp-3">
                    {book.bookDetails.summary}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
}
