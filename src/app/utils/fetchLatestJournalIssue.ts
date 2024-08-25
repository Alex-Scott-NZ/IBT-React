import { fetchGraphData } from './fetchGraphData';
import { GET_LATEST_JOURNAL_ISSUE } from '../graphql/queries/getLatestJournal';
import { JournalIssueLatest } from '../types/Article';

// Define the expected response type
interface FetchLatestJournalIssueResponse {
  journalIssues: {
    nodes: JournalIssueLatest[];
  };
}

export async function fetchLatestJournalIssue(): Promise<JournalIssueLatest | null> {
  try {
    // Explicitly type the data as FetchLatestJournalIssueResponse | null
    const data = await fetchGraphData<FetchLatestJournalIssueResponse>(GET_LATEST_JOURNAL_ISSUE);

    // Check if data is null
    if (!data) {
      return null;
    }

    // Safely access data properties
    return data.journalIssues.nodes[0] || null;
  } catch (error) {
    console.error('Error fetching latest journal issue:', error);
    return null;
  }
}
