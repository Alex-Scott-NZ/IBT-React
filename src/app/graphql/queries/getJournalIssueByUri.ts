import { gql } from 'graphql-request';
import { JournalIssue } from '../../types/ArticlesInJournal';

export const GET_JOURNAL_BY_URI = gql`
  query GetJournalByUri($uri: String!) {
    journalIssueBy(uri: $uri) {
      title
      featuredImage {
        node {
          mediaDetails {
            file
            height
            width
          }
          mediaItemId
          srcSet
          slug
          mediaItemUrl
          mediaType
          mimeType
        }
      }
      journalIssueDetails {
        fieldGroupName
        publicationDate
        articlesInJournal {
          nodes {
            slug
            ... on Article {
              articleDetails {
                displayDate
                displayOnFrontPage
                fieldGroupName
                publicationDate
                source
                subtitle
                suppressDate
                tableOfContentsTitle
              }
              title
              uri
            }
          }
        }
      }
    }
  }
`;

export interface GetJournalByUriResponse {
  journalIssueBy: JournalIssue;
}
