import { gql } from 'graphql-request';
import { DetailedArticle } from '../../types/Article';

export const GET_ARTICLE_BY_ID = gql`
  query GetArticleById($id: ID!) {
    article(id: $id, idType: DATABASE_ID) {
      articleId
      content
      contentTypeName
      databaseId
      date
      dateGmt
      featuredImageDatabaseId
      featuredImageId
      id
      isTermNode
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
      featuredImage {
        cursor
        node {
          altText
          authorDatabaseId
          authorId
          caption
          contentTypeName
          databaseId
          date
          dateGmt
          description
          desiredSlug
          fileSize
          guid
          hasPassword
          id
          mediaItemId
          mediaItemUrl
          mediaType
          mimeType
          modified
          modifiedGmt
          parentDatabaseId
          parentId
          sizes
          slug
          sourceUrl
          srcSet
          title
          uri
        }
      }
    }
  }
`;

export interface GetArticleByIdResponse {
  article: DetailedArticle;
}
