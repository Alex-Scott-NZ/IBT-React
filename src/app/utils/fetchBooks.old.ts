import { fetchGraphData } from './fetchGraphData';
import { GET_ALL_BOOKS } from '../graphql/queries/getBooksAll';
import { Book } from '../types/Article';

// Define the expected response type
interface FetchBooksResponse {
  books: {
    nodes: Book[];
  };
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const data = await fetchGraphData<FetchBooksResponse>(GET_ALL_BOOKS);

    // Check if data is null
    if (!data) {
      return [];
    }

    return data.books.nodes;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}
