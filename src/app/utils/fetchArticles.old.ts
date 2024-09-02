import { fetchGraphData } from './fetchGraphData';
import { GET_FRONT_PAGE_ARTICLES } from '../graphql/queries/getFrontPageArticles';
import { FrontPageArticle } from '../types/Article';

// Define the expected response type
interface FetchArticlesResponse {
  articles: {
    nodes: FrontPageArticle[];
  };
}

export async function fetchArticles(): Promise<FrontPageArticle[]> {
  try {
    const data = await fetchGraphData<FetchArticlesResponse>(GET_FRONT_PAGE_ARTICLES);

    // Check if data is null
    if (!data) {
      return [];
    }

    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}
