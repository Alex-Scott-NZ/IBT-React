import { gql } from 'graphql-request';

export const GET_GLOBAL_SETTINGS = gql`
  query GlobalSettings {
    globalSettings {
      nodes {
        fGGlobalSettings {
          bannerImage {
            node {
              altText
              sourceUrl
              title
            }
          }
        }
      }
    }
  }
`;

export interface BannerImageNode {
  altText: string;
  sourceUrl: string;
  title: string;
}

export interface FGGlobalSettings {
  bannerImage: {
    node: BannerImageNode;
  };
}

export interface GlobalSettingsNode {
  fGGlobalSettings: FGGlobalSettings;
}

export interface GlobalSettingsData {
  globalSettings: {
    nodes: GlobalSettingsNode[];
  };
}
