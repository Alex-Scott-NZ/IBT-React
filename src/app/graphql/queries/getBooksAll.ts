import { gql } from 'graphql-request';

export const GET_ALL_BOOKS = gql`
query Books {
    books {
        nodes {
            authorDatabaseId
            contentTypeName
            featuredImageDatabaseId
            featuredImageId
            id
            isComment
            isContentNode
            isFrontPage
            isPostsPage
            isPreview
            isRestricted
            isTermNode
            link
            modified
            modifiedGmt
            parentDatabaseId
            parentId
            password
            previewRevisionDatabaseId
            previewRevisionId
            slug
            status
            title
            uri
            bookDetails {
                displayOnIbtBooks
                fieldGroupName
                subheading
                summary
            }
            featuredImage {
                node {
                    altText
                    link
                    mediaItemId
                    mediaItemUrl
                    description
                    guid
                    id
                    sizes
                    slug
                    sourceUrl
                    srcSet
                }
            }
        }
    }
}
`;
