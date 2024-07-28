// src/app/components/FeaturedArticles.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontPageArticle } from '../types/Article';
import { getImageUrl } from '../utils/imageHelpers';
import { Card, CardActionArea, Typography, Grid, Box } from '@mui/material';

interface FeaturedArticlesProps {
  articles: FrontPageArticle[];
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
  const router = useRouter();

  const handleArticleClick = (slug: string) => {
    router.push(`/domain/article/${slug}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (articles.length === 0) {
    return <Typography>No featured articles available.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {articles.map((article) => (
        <Grid item xs={12} md={6} key={article.id}>
          <Card sx={{ position: 'relative', height: 225 }}>
            <CardActionArea 
              onClick={() => handleArticleClick(article.slug)}
              sx={{ height: '100%' }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${getImageUrl(article.featuredImage)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)',
                  }
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
                <Typography variant="body2" fontSize="0.8rem" gutterBottom>
                  {formatDate(article.articleDetails.publicationDate)}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom noWrap>
                  {article.title}
                </Typography>
                {article.articleDetails.subtitle && (
                  <Typography variant="body2" fontSize="0.8rem" noWrap>
                    {article.articleDetails.subtitle}
                  </Typography>
                )}
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturedArticles;