import { gql } from 'graphql-request';

// Define the GraphQL query
export const GET_PLACEHOLDER_SETTINGS = gql`
  query PlaceholderSettings {
    placeholderSettings {
      placeholderSettingsFields {
        placeholderSetup {
          contentSelector
          placeholderSelector
          textContent
        }
      }
    }
  }
`;

// Define TypeScript interfaces to type the response
export interface PlaceholderSetup {
  contentSelector: string[];
  placeholderSelector: string[];
  textContent: string[];
}

export interface PlaceholderSettingsFields {
  placeholderSetup: PlaceholderSetup[];
}

export interface PlaceholderSettingsData {
  placeholderSettings: {
    placeholderSettingsFields: PlaceholderSettingsFields;
  };
}