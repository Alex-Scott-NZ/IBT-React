"use client";

import React from 'react';
import { JournalIssueLatest } from '../types/Article';
import { getImageUrl } from '../utils/imageHelpers';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface LatestJournalIssueWidgetProps {
  latestJournalIssue: JournalIssueLatest | null;
}

const LatestJournalIssueWidget: React.FC<LatestJournalIssueWidgetProps> = ({ latestJournalIssue }) => {
  const router = useRouter();

  if (!latestJournalIssue) {
    return <p>No latest journal issue available.</p>;
  }

  const handleJournalClick = (slug: string) => {
    router.push(`/journal/${slug}`);
  };

  return (
    <div className="latest-journal-issue-widget relative">
      <Box
        marginBottom={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/journal" passHref>
          <Typography
            className="text-communist-red mt-0 mb-0"
            variant="h5"
            component="span"
          >
            <span className="font-telegrafico">Latest </span>
            <span className="font-telegrafico"> Journal</span>
          </Typography>
        </Link>
      </Box>
      <Card elevation={0}
        sx={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
 
          background: 'transparent',
          border: 'none'
          
        }}
      >
        <CardActionArea
          onClick={() => handleJournalClick(latestJournalIssue.slug)}
          sx={{ width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              overflow: 'hidden',
            }}
          >

            <Box
              sx={{
                width: '33%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={getImageUrl(latestJournalIssue.featuredImage?.node, 164)} // 50% of the card width (328px)
                alt={latestJournalIssue.featuredImage?.node?.altText || latestJournalIssue.title}
                width={328} // Set the width based on your design
                height={0} // Automatically calculate height to maintain aspect ratio
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
                layout="responsive"
              />
            </Box>

            <Box
              sx={{
                width: '67%',
                paddingLeft: '8px', // Ensure padding on the left side of the text
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" className="font-helvetica">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel ligula non elit bibendum tincidunt.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ paddingTop: '8px', textAlign: 'center' }}>
            <Typography variant="h6" className="font-cambay" sx={{ marginTop: '8px' }}>
              {latestJournalIssue.title}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default LatestJournalIssueWidget;
