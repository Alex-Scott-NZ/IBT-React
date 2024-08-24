import { GraphQLClient } from 'graphql-request';
import { GET_GLOBAL_SETTINGS } from '../graphql/queries/getGlobalSettings';
import { GlobalSettingsData } from '../types/Article';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'max-age=60',
  },
  fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 60 } }),
});

export async function fetchGlobalSettings(): Promise<GlobalSettingsData | null> {
  try {
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data || null;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
}
