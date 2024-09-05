'use client';

import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import Image from 'next/image';

interface FreeTextWidgetProps {
  heading: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
}

const FreeTextWidget: React.FC<FreeTextWidgetProps> = ({ heading, content, imageUrl, imageAlt }) => {
  return (
    <div className="free-text-widget relative mt-4">
      <Box
        marginBottom={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          className="text-communist-red mt-0 mb-0"
          variant="h5"
          component="span"
        >
          <span className="font-telegrafico">{heading}</span>
        </Typography>
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
                width: '50%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={328}
                height={0}
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
                width: '50%', // Adjusted to match image width
                paddingLeft: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography variant="body2" className="font-helvetica">
                {content}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default FreeTextWidget;