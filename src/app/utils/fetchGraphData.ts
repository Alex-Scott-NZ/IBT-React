import { GraphQLClient } from 'graphql-request';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'max-age=60',
  },
  fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 60 } }),
});

export const fetchGraphData = async <T>(query: string, variables?: Record<string, unknown>): Promise<T | null> => {
  try {
    const data = await graphQLClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
    return null;
  }
};