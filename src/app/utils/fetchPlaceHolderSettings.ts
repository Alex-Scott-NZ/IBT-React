// utils/fetchPlaceHolderSettings.ts
import { fetchGraphData } from './fetchGraphData';
import { GET_PLACEHOLDER_SETTINGS } from '../graphql/queries/getPlaceHolderSettings';
import { PlaceholderSettingsData } from '../graphql/queries/getPlaceHolderSettings';

export async function fetchPlaceHolderSettings(): Promise<PlaceholderSettingsData | null> {
  return fetchGraphData<PlaceholderSettingsData>(GET_PLACEHOLDER_SETTINGS);
}
