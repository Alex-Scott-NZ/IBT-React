// utils/fetchGlobalSettings.ts
import { fetchGraphData } from './fetchGraphData';
import { GET_GLOBAL_SETTINGS } from '../graphql/queries/getGlobalSettings';
import { GlobalSettingsData } from '../types/Article';

export async function fetchGlobalSettings(): Promise<GlobalSettingsData | null> {
  return fetchGraphData<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
}
