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
import { BannerImageNode, JournalIssueNode, GlobalSettingsData } from '../types/Article';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageHelpers';

async function fetchJournalIssues() {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);
    const { journalIssues } = await graphQLClient.request<{ journalIssues: { nodes: JournalIssueNode[] } }>(GET_ALL_JOURNAL_ISSUES);
    return journalIssues.nodes;
  } catch (error) {
    console.error('Error fetching journal issues:', error);
    return [];
  }
}

async function fetchBannerData(): Promise<BannerImageNode | null> {
  try {
    const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null;
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
}

const JournalPage = async () => {
  const [journalIssues, bannerData] = await Promise.all([fetchJournalIssues(), fetchBannerData()]);

  return (
    <BaseLayoutNoSideBars bannerData={bannerData}>
      <div className="p-4">
        <h1 className="font-cambay text-communist-red">All Journal Issues</h1>
        <Grid container spacing={4}>
          {journalIssues.map((issue) => (
            <Grid item xs={12} sm={6} md={4} key={issue.slug}>
              <Card>
                <CardMedia
                  component="img"
                //   height="200"
                  image={getImageUrl({
                    srcSet: issue.featuredImage?.node.srcSet || '',
                    sourceUrl: issue.featuredImage?.node.sourceUrl
                  }, 440)}
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
                    {issue.journalIssueDetails.articlesInJournal.nodes.map(
                      (article) => (
                        <ListItem key={article.id}>
                          <Link
                            href={`/article/${article.slug}`}
                            passHref
                          >
                            <Typography
                              variant="body1"
                              className="font-helvetica"
                            >
                              {article.articleDetails.tableOfContentsTitle || article.title}
                            </Typography>
                          </Link>
                        </ListItem>
                      )
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
