"use client";

import React from 'react';
import { GetJournalIssuesLatestQuery } from '../../gql/gql-generated';
import { getImageUrl } from '../utils/imageHelpers';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

interface LatestJournalIssueWidgetProps {
  latestJournalIssue: GetJournalIssuesLatestQuery
}

const LatestJournalIssueWidget: React.FC<LatestJournalIssueWidgetProps> = ({ latestJournalIssue }) => {
  const router = useRouter();

  if (!latestJournalIssue ) {
    return <p>No latest journal issue available.</p>;
  }

  const latestIssue = latestJournalIssue.journalIssues?.nodes[0];

  const handleJournalClick = (slug: string | null | undefined) => {
    if (slug) {
      router.push(`/journal/${slug}`);
    }
  };

  return (
    (<div className="latest-journal-issue-widget relative mb-4">
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
            <span className="font-telegrafico">Latest Journal</span>
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
          onClick={() => handleJournalClick(latestIssue?.slug)}
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
                // 50% of the card width (328px)
                src={getImageUrl(latestIssue?.featuredImage?.node, 164)}
                alt={latestIssue?.featuredImage?.node?.altText || latestIssue?.title || 'Latest Journal Issue'}
                // Set the width based on your design
                width={328}
                // Automatically calculate height to maintain aspect ratio
                height={0}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  width: "100%",
                  height: "auto"
                }} />
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
              {latestIssue?.title}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </div>)
  );
};

export default LatestJournalIssueWidget;
