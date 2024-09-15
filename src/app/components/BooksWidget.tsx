'use client';

import React, { useState, useCallback } from 'react';
import { GetBooksQuery } from '../../gql/gql-generated';
import { getImageUrl } from '../utils/imageHelpers';
import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  // Divider, styled,
} from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface BooksWidgetProps {
  books: GetBooksQuery;
}

// Create a styled Divider using the Tailwind CSS color variable
// const StyledDivider = styled(Divider)({
//   borderColor: '#B00909',
//   borderWidth: '1px',
//   height: '20px', // Match the height of your buttons
//   marginX: '20px', // Adjust spacing as needed
// });

const BooksWidget: React.FC<BooksWidgetProps> = ({ books }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const router = useRouter();

  const handlePrevious = useCallback((event: React.MouseEvent) => {
    event?.stopPropagation();
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback((event: React.MouseEvent) => {
    event?.stopPropagation();
    swiperRef?.slideNext();
  }, [swiperRef]);

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const booksList = books?.books?.nodes || [];

  return (
    <div className="books-widget relative mb-4">
      <Box
        marginBottom={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/book" passHref>
          <Typography
            className="font-telegrafico text-communist-red mt-0 mb-0"
            variant="h5"
          >
            Books
          </Typography>
        </Link>

      </Box>
      <Swiper
        className='p-0'
        onSwiper={setSwiperRef}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={false}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Navigation, EffectFade]}
        loop={true}
        allowTouchMove={false}
        style={{
          // width: 'calc(100% + 20px)',
          // height: 'calc(200px + 20px)',
          // marginLeft: '-10px',
          // padding: '5px 10px 10px 10px',
        }}
      >
        {booksList.map((book) => (
          <SwiperSlide key={book.id}>
            <Card elevation={0} className='p-0'
              sx={{
                Width: '100%',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent'
              }}
            >
              <CardActionArea
                onClick={() => handleBookClick(book.id)}
                sx={{ height: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    height: '100%',
                  }}
                >

                  <Box
                    sx={{
                      width: '45%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      marginRight: '8px',
                    }}
                  >
                    <Image
                      src={getImageUrl(book.featuredImage?.node, 128)}
                      alt={book.featuredImage?.node?.altText || book.title || ''}
                      layout="fill" // Fills the container dimensions
                      objectFit="cover" // Ensures the image covers the entire box
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h6" className="font-helvetica" fontSize={16} fontWeight={'bold'}>
                      {book.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      component="div"
                      className="font-helvetica"
                      sx={{ marginTop: '8px' }}
                    >
                      {book.bookDetails?.subheading}
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <Box
        marginTop={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',  // Center the ButtonGroup within the Box
          alignItems: 'center',       // Vertically center the ButtonGroup (optional)
        }}
      >
        <ButtonGroup
          sx={{
            boxShadow: 0.5,
            backgroundColor: '#EAEAE2',
            borderRadius: '5px',
            overflow: 'hidden',
            width: '100%',  // Set the width for the ButtonGroup
            justifyContent: 'center', // Center the buttons within the ButtonGroup
          }}
        >
          <IconButton
            onClick={handlePrevious}
            sx={{
              flex: 1,                 // Make the button take equal space
              justifyContent: 'center', // Center the icon within the button
              borderRadius: '10px'
            }}
          >
            <ArrowBackIos
              sx={{ marginLeft: '0px' }} // Remove margin if needed
              fontSize="small"
              className="text-communist-red"
            />
          </IconButton>
          {/* <StyledDivider orientation='vertical' variant='middle' /> */}
          <IconButton
            onClick={handleNext}
            sx={{
              flex: 1,                 // Make the button take equal space
              justifyContent: 'center', // Center the icon within the button
              borderRadius: '10px'
            }}
          >
            <ArrowForwardIos
              sx={{ marginLeft: '0px' }} // Remove margin if needed
              fontSize="small"
              className="text-communist-red"
            />
          </IconButton>
        </ButtonGroup>
      </Box>


    </div>
  );
};

export default BooksWidget;
