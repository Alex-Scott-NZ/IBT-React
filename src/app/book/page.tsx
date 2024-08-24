import React from 'react';
import BaseLayoutNoSideBars from '../layouts/BaseLayoutNoSideBars';
import { Book } from '../types/Article';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import { GET_ALL_BOOKS } from '../graphql/queries/getBooksAll';
import { GraphQLClient } from 'graphql-request';
import { fetchGlobalSettings } from '../utils/fetchGlobalSettings';
import Link from 'next/link';

async function fetchBooks() {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
      headers: {
        'Cache-Control': 'max-age=60',
      },
      fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 60 } }),
    });
    const { books } = await graphQLClient.request<{ books: { nodes: Book[] } }>(
      GET_ALL_BOOKS
    );
    return books.nodes;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

const BooksPage = async () => {
  const [books, globalSettings] = await Promise.all([
    fetchBooks(),
    fetchGlobalSettings(),
  ]);

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div>
        <h1 className="font-cambay text-communist-red">All Books</h1>
        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.featuredImage.node.sourceUrl}
                  alt={book.featuredImage.node.altText}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    className="font-cambay"
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    className="font-cambay"
                  >
                    {book.bookDetails.subheading}
                  </Typography>
                  <List>
                    {book.bookDetails.relatedArticles?.edges?.map(
                      (articleEdge) => (
                        <ListItem key={articleEdge.node.id}>
                          <Link
                            href={`/article/${articleEdge.node.slug}`}
                            passHref
                          >
                            <Typography
                              variant="body2"
                              className="font-cambay"
                            >
                              {articleEdge.node.articleDetails
                                .tableOfContentsTitle || articleEdge.node.title}
                            </Typography>
                          </Link>
                        </ListItem>
                      )
                    ) || (
                      <ListItem>
                        <Typography variant="body2" className="font-cambay">
                          No related articles
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </BaseLayoutNoSideBars>
  );
};

export default BooksPage;
