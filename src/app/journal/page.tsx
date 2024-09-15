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
import { getImageUrl } from '../utils/imageHelpers';
import { GetJournalIssuesQuery, useGetJournalIssuesQuery, GetGlobalSettingsQuery, useGetGlobalSettingsQuery, FragmentFeaturedImageFragment } from '../../gql/gql-generated';
import { serverFetch } from '../../gql/query-utils';

export const revalidate = 60; // Ensure no caching

// Define a type for the possible node types
type ArticleNode = {
  __typename?: "Article";
  title?: string | null;
  slug?: string | null;
  id?: string;
  articleDetails?: {
    tableOfContentsTitle?: string | null;
  } | null;
};

const JournalPage = async () => {
  const journalIssuesData: GetJournalIssuesQuery = await serverFetch(useGetJournalIssuesQuery);
  const globalSettingsData: GetGlobalSettingsQuery = await serverFetch(useGetGlobalSettingsQuery);

  const journalIssues = journalIssuesData.journalIssues?.nodes || [];
  const globalSettings = globalSettingsData.globalSettings;

  // Sort journal issues by slug (assuming newer issues have higher numbers)
  const orderedJournalIssues = [...journalIssues].sort((a, b) => (b.slug || '').localeCompare(a.slug || ''));

  return (
    <BaseLayoutNoSideBars globalSettings={globalSettings}>
      <div>
        <h1 className="font-cambay text-communist-red">All Journal Issues</h1>
        <Grid container spacing={2}>
          {orderedJournalIssues.map((issue) => {
            const featuredImage: FragmentFeaturedImageFragment | null = issue.featuredImage?.node || null;
            return (
              <Grid item xs={12} sm={6} md={3} key={issue.slug}>
                <Card>
                  <Link href={`/journal/${issue.slug}`} passHref>
                    <CardMedia
                      component="img"
                      image={featuredImage ? getImageUrl(featuredImage, 440) : '/placeholder-image.jpg'}
                      alt={featuredImage?.altText || issue.title || 'Journal cover'}
                    />
                  </Link>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="font-cambay"
                    >
                      {issue.title}
                    </Typography>
                    <List>
                      {issue.journalIssueDetails?.articlesInJournal?.nodes?.length ? (
                        issue.journalIssueDetails.articlesInJournal.nodes.map(
                          (node, index) => {
                            const article = node as ArticleNode;
                            if (article.__typename === 'Article') {
                              return (
                                <ListItem key={article.id || article.slug || index}>
                                  <Link href={`/article/${article.slug}`} passHref>
                                    <Typography
                                      variant="body1"
                                      className="font-helvetica"
                                    >
                                      {article.articleDetails?.tableOfContentsTitle ||
                                        article.title}
                                    </Typography>
                                  </Link>
                                </ListItem>
                              );
                            }
                            return null;
                          }
                        ).filter(Boolean)
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
            );
          })}
        </Grid>
      </div>
    </BaseLayoutNoSideBars>
  );
};

export default JournalPage;
