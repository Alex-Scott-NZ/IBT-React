import React from 'react';
import { 
  PlaceholderSettingsFieldsPlaceholderSetupTextContentGroup
} from '../../gql/gql-generated';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import Link from 'next/link';
import Image from "next/legacy/image";

type PlaceholderProps = {
  textContentGroup: PlaceholderSettingsFieldsPlaceholderSetupTextContentGroup;
};

const PlaceholderWidget: React.FC<PlaceholderProps> = ({ textContentGroup }) => {
  if (!textContentGroup) return null;

  return (
    <div className="placeholder-widget relative mb-4">
      <Box
        marginBottom={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {textContentGroup.freeTextHeading && (
          <Typography
            className="text-communist-red mt-0 mb-0"
            variant="h5"
            component="span"
          >
            <span className="font-telegrafico">{textContentGroup.freeTextHeading}</span>
          </Typography>
        )}
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
          component={textContentGroup.freeTextLink?.nodes?.[0]?.link ? Link : 'div'}
          href={textContentGroup.freeTextLink?.nodes?.[0]?.link || '#'}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {textContentGroup.freeTextImage?.node?.srcSet && (
              <Box
                sx={{
                  width: '33%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={textContentGroup.freeTextImage.node.srcSet.split(' ')[0]}
                  alt={textContentGroup.freeTextImage.node.altText || ''}
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
            )}
            <Box
              sx={{
                width: textContentGroup.freeTextImage?.node?.srcSet ? '67%' : '100%',
                paddingLeft: textContentGroup.freeTextImage?.node?.srcSet ? '8px' : '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" className="font-helvetica">
                {textContentGroup.textContent}
              </Typography>
            </Box>
          </Box>
          {textContentGroup.freeTextLink?.nodes?.[0]?.slug && (
            <Box sx={{ paddingTop: '8px', textAlign: 'center' }}>
              <Typography variant="h6" className="font-cambay" sx={{ marginTop: '8px' }}>
                {textContentGroup.freeTextLink.nodes[0].slug}
              </Typography>
            </Box>
          )}
        </CardActionArea>
      </Card>
    </div>
  );
};

export default PlaceholderWidget;
