import { gql } from 'graphql-request';

export const GET_GLOBAL_SETTINGS = gql`
query GlobalSettings {
    globalSettings {
        fGGlobalSettings {
            bannerImage {
                cursor
                node {
                    altText
                    srcSet
                    sourceUrl
                }
            }
            notificationBar {
                fieldGroupName
                notificationMessage
                notificationOnoff
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
