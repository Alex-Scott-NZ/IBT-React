import { gql } from 'graphql-request';

export const GET_ALL_JOURNAL_ISSUES = gql`
query JournalIssues {
    journalIssues {
        nodes {
            journalIssueDetails {
                articlesInJournal {
                    nodes {
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
                            slug
                            id
                        }
                        slug
                    }
                }
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
                }
            }
        }
    }
}
`;
