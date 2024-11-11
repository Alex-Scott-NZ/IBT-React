import React from 'react';
import BaseLayoutNoSideBars from '../layouts/BaseLayoutNoSideBars';

import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
} from '@mui/material';

import Link from 'next/link';
import {
  GetBooksQuery,
  useGetBooksQuery,
  GetGlobalSettingsQuery,
  useGetGlobalSettingsQuery,
} from '@/gql/gql-generated';
import { serverFetch } from '@/gql/query-utils';

const BooksPage = async () => {
  const booksData: GetBooksQuery = await serverFetch(useGetBooksQuery, {
    next: { revalidate: 60 },
  });
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(
    useGetGlobalSettingsQuery,
    { next: { revalidate: 60 } }
  );

  const books = booksData.books?.nodes || [];
  const globalSettings = globalSettingsData.globalSettings;

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
                  image={
                    book.featuredImage?.node.sourceUrl ||
                    '/placeholder-book-image.jpg'
                  }
                  alt={
                    book.featuredImage?.node.altText ||
                    book.title ||
                    'Book Cover'
                  }
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
                    {book.bookDetails?.subheading}
                  </Typography>
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
