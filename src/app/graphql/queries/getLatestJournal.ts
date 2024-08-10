import { gql } from 'graphql-request';

export const GET_LATEST_JOURNAL_ISSUE = gql`
query JournalIssues {
    journalIssues(
        where: {
            metaQuery: [{ key: "publication_date", compare: "EXISTS" }]
            orderby: { field: META_VALUE_NUM, order: DESC }
            metaKey: "publication_date"
        }
        first: 1
    ) {
        nodes {
            journalIssueDetails {
                fieldGroupName
                publicationDate
            }
            slug
            title
            featuredImage {
                node {
                    altText
                    mediaItemId
                    srcSet
                    sourceUrl
                }
            }
        }
    }
}
`;