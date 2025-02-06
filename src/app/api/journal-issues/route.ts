// /src/app/api/journal-issues/route.ts
import { NextResponse } from 'next/server';
import {
  useGetJournalIssuesQuery,
  GetJournalIssuesQuery,
} from '@/gql/gql-generated';
import { serverFetch } from '@/gql/query-utils';

export const revalidate = 60; // Set revalidation time

export async function GET() {
  try {
    // Fetch data using serverFetch
    const data: GetJournalIssuesQuery = await serverFetch(
      useGetJournalIssuesQuery,
      {} // Remove next config here since we're using export const revalidate
    );

    // Null check and sorting
    if (!data.journalIssues?.nodes) {
      return NextResponse.json([], { status: 200 });
    }

    const sortedIssues = data.journalIssues.nodes
      .filter(Boolean) // Remove any null values
      .sort((a, b) => 
        (b?.slug ?? '').localeCompare(a?.slug ?? '')
      );

    return NextResponse.json(sortedIssues, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching journal issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal issues' },
      { status: 500 }
    );
  }
}
