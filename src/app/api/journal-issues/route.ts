import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';
import { GET_ALL_JOURNAL_ISSUES } from '../../graphql/queries/getJournalIssuesAll';
import { JournalIssuesResponse } from '../../types/Article';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'max-age=60',
  },
});

export async function GET() {
  try {
    const data: JournalIssuesResponse = await graphQLClient.request(GET_ALL_JOURNAL_ISSUES);
    const sortedIssues = data.journalIssues.nodes.sort((a, b) => b.slug.localeCompare(a.slug));
    return NextResponse.json(sortedIssues);
  } catch (error) {
    console.error('Error fetching journal issues:', error);
    return NextResponse.json({ error: 'Failed to fetch journal issues' }, { status: 500 });
  }
}