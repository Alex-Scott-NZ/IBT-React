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
import { GraphQLClient } from 'graphql-request';
import { GET_ALL_JOURNAL_ISSUES } from '../graphql/queries/getJournalIssuesAll';
import {
  JournalIssueNode,
} from '../types/Article';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageHelpers';
import { fetchGlobalSettings } from '../utils/fetchGlobalSettings';

export const revalidate = 60; // Ensure no caching

// Initialize the GraphQL client with cache-control headers
const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`, {
  headers: {
    'Cache-Control': 'max-age=60',
  },
  fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 60 } }),
});

// Function to fetch all journal issues
async function fetchJournalIssues() {
  try {
    const { journalIssues } = await graphQLClient.request<{ journalIssues: { nodes: JournalIssueNode[] } }>(GET_ALL_JOURNAL_ISSUES);
    const orderedJournalIssues = journalIssues.nodes.sort((a, b) => b.slug.localeCompare(a.slug));
    return orderedJournalIssues;
  } catch (error) {
    console.error('Error fetching journal issues:', error);
    return [];
  }
}



// Main component for rendering the journal page
const JournalPage = async () => {
  const [journalIssues, globalSettings] = await Promise.all([
    fetchJournalIssues(),
    fetchGlobalSettings(),
  ]);

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div>
        <h1 className="font-cambay text-communist-red">All Journal Issues</h1>
        <Grid container spacing={2}>
          {journalIssues.map((issue) => (
            <Grid item xs={12} sm={6} md={3} key={issue.slug}>
              <Card>
                <CardMedia
                  component="img"
                  image={getImageUrl(
                    {
                      srcSet: issue.featuredImage?.node.srcSet || '',
                      sourceUrl: issue.featuredImage?.node.sourceUrl,
                    },
                    440
                  )}
                  alt={issue.featuredImage?.node.altText || 'Default alt text'}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    className="font-cambay"
                  >
                    {issue.title}
                  </Typography>
                  <List>
                    {issue.journalIssueDetails.articlesInJournal?.nodes?.length ? (
                      issue.journalIssueDetails.articlesInJournal.nodes.map(
                        (article) => (
                          <ListItem key={article.id}>
                            <Link href={`/article/${article.slug}`} passHref>
                              <Typography
                                variant="body1"
                                className="font-helvetica"
                              >
                                {article.articleDetails.tableOfContentsTitle ||
                                  article.title}
                              </Typography>
                            </Link>
                          </ListItem>
                        )
                      )
                    ) : (
                      <ListItem>
                        <Typography variant="body1" className="font-helvetica">
                          No articles available
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

export default JournalPage;
