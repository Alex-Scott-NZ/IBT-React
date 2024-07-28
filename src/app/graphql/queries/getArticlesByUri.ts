// src/graphql/queries/getArticleByUri.ts
import { gql } from 'graphql-request';
import { DetailedArticle } from '../../types/Article';

export const GET_ARTICLE_BY_URI = gql`
  query GetArticleByUri($uri: ID!) {
    article(id: $uri, idType: URI) {
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

export interface GetArticleByUriResponse {
  article: DetailedArticle;
}