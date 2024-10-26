import Link from 'next/link';
import React from 'react';
// import { FrontPageArticle } from '../types/Article';
import { GetArticlesQuery } from '@/gql/gql-generated';
import { getImageUrl } from '../utils/imageHelpers';
import { Card, CardActionArea, Typography, Grid, Box } from '@mui/material';
import { FragmentFeaturedImageFragment } from '@/gql/graphql';



interface FeaturedArticlesProps {
  articles: NonNullable<GetArticlesQuery['articles']>['nodes'];
  onArticleClick: (slug: string) => void;
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return ''; // Return an empty string if dateString is undefined or null
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).replace(',', ''); // Removing commas if any
  };


  if (articles.length === 0) {
    return <Typography>No featured articles available.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {articles.map((article) => {
        const image = article.featuredImage?.node as Partial<FragmentFeaturedImageFragment> | undefined;
        return (
          <Grid item xs={12} md={6} key={article.id}>
            <Link href={`/article/${article.slug}`} passHref>
              <Card elevation={1} sx={{ position: 'relative', height: 225 }}>
                <CardActionArea sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${getImageUrl(image, 352)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(0,0,0,1) 100%)',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: 2,
                      color: 'white',
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="body2" fontSize="0.8rem">
                      {article.articleDetails?.suppressDate
                        ? article.articleDetails.displayDate
                        : formatDate(article.articleDetails?.publicationDate)}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {article.title}
                    </Typography>
                    {article.articleDetails?.subtitle && (
                      <Typography variant="body2" fontSize="0.8rem" noWrap>
                        {article.articleDetails.subtitle}
                      </Typography>
                    )}
                  </Box>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        )
      })}
    </Grid>
  );
};

export default FeaturedArticles;
