import { gql } from 'graphql-request';

export const GET_FRONT_PAGE_ARTICLES = gql`
  query Articles {
    articles(
      first: 50
      where: {
        orderby: { field: META_VALUE_NUM, order: DESC }
        metaKey: "publication_date"
        metaQuery: [
          { 
            key: "display_on_front_page", 
            compare: "=", 
            value: "1"
          }
        ]
      }
    ) {
      nodes {
        id
        title
        content
        slug
        featuredImage {
          cursor
          node {
            altText
            uri
            title
          }
        }
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
      }
    }
  }
`;
