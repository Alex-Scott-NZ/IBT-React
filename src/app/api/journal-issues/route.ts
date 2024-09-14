import { NextResponse } from 'next/server';
import { useGetJournalIssuesQuery, GetJournalIssuesQuery } from '@/gql/gql-generated';
import { serverFetch } from '@/gql/query-utils';

export async function GET() {
  try {
    // Use the generated hook for fetching journal issues
    const data: GetJournalIssuesQuery = await serverFetch(useGetJournalIssuesQuery);

    const sortedIssues = data.journalIssues!.nodes!.sort((a, b) => b.slug!.localeCompare(a.slug!));
    return NextResponse.json(sortedIssues);
  } catch (error) {
    console.error('Error fetching journal issues:', error);
    return NextResponse.json({ error: 'Failed to fetch journal issues' }, { status: 500 });
  }
}