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
import { GET_GLOBAL_SETTINGS } from '../graphql/queries/getGlobalSettings';
import {
  BannerImageNode,
  JournalIssueNode,
  GlobalSettingsData,
} from '../types/Article';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageHelpers';

/**
 * Function to fetch all journal issues from the backend.
 * It uses GraphQL to request data from the API and returns an array of journal issues.
 */
async function fetchJournalIssues() {
    try {
      const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
      const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);
      
      // Fetch journal issues data from the API
      const { journalIssues } = await graphQLClient.request<{ journalIssues: { nodes: JournalIssueNode[] } }>(GET_ALL_JOURNAL_ISSUES);
      
      // This is where we order the results by slug to make the most recent at the top.
      // We sort the journal issues by their slugs in reverse alphabetical order.
      const orderedJournalIssues = journalIssues.nodes.sort((a, b) => {
        return b.slug.localeCompare(a.slug);
      });
  
      // Return the ordered list of journal issues
      return orderedJournalIssues;
    } catch (error) {
      // Log any errors that occur during the fetch
      console.error('Error fetching journal issues:', error);
  
      // Return an empty array if an error occurs
      return [];
    }
  }

/**
 * Function to fetch banner data from the backend.
 * It uses GraphQL to request data from the API and returns the banner image data or null if not found.
 */
async function fetchBannerData(): Promise<BannerImageNode | null> {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);
    
    // Fetch global settings data to get the banner image
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null;
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
}

/**
 * Main component for rendering the journal page.
 * It fetches journal issues and banner data and displays them in a grid layout.
 */
const JournalPage = async () => {
  // Fetch journal issues and banner data in parallel
  const [journalIssues, bannerData] = await Promise.all([
    fetchJournalIssues(),
    fetchBannerData(),
  ]);

  return (
    <BaseLayoutNoSideBars bannerData={bannerData}>
      <div className="p-4">
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
