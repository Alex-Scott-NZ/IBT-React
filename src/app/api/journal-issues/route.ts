// /src/app/api/journal-issues/route.ts
import { NextResponse } from 'next/server';
import {
  useGetJournalIssuesQuery,
  GetJournalIssuesQuery,
  LanguageCodeFilterEnum, // Update this import
} from '@/gql/gql-generated';
import { serverFetch } from '@/gql/query-utils';

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    // Get language from URL parameters
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang')?.toUpperCase() || 'EN') as LanguageCodeFilterEnum;

    // Fetch data using serverFetch with language parameter
    const data: GetJournalIssuesQuery = await serverFetch(
      useGetJournalIssuesQuery,
      {
        variables: { language: lang }
      }
    );

    // Null check and sorting
    if (!data.journalIssues?.nodes) {
      return NextResponse.json([], { status: 200 });
    }

    const sortedIssues = data.journalIssues.nodes
      .filter(Boolean)
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