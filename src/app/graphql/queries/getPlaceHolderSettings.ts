import { gql } from 'graphql-request';

// Define the GraphQL query
export const GET_PLACEHOLDER_SETTINGS = gql`
  query PlaceholderSettings {
    placeholderSettings {
      placeholderSettingsFields {
        placeholderSetup {
          contentSelector
          placeholderSelector
          textContentGroup {
            freeTextHeading
            textContent
            freeTextImage {
              node {
                srcSet
              }
            }
          }
        }
      }
    }
  }
`;

// Define TypeScript interfaces to type the response
export interface FreeTextImage {
  node: {
    srcSet: string;
  };
}

export interface TextContentGroup {
  freeTextHeading: string;
  textContent: string;
  freeTextImage: FreeTextImage;
}

export interface PlaceholderSetup {
  contentSelector: string[];
  placeholderSelector: string[];
  textContentGroup: TextContentGroup;
}

export interface PlaceholderSettingsFields {
  placeholderSetup: PlaceholderSetup[];
}

export interface PlaceholderSettingsData {
  placeholderSettings: {
    placeholderSettingsFields: PlaceholderSettingsFields;
  };
}