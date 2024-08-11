'use client';

import React, { useState, useCallback } from 'react';
import { Book } from '../types/Article';
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
  Divider, styled,
  lighten
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
  books: Book[];
}

// Create a styled Divider using the Tailwind CSS color variable
const StyledDivider = styled(Divider)({
  borderColor: '#B00909',
  borderWidth: '1px',
  height: '20px', // Match the height of your buttons
  marginX: '20px', // Adjust spacing as needed
});


const BooksWidget: React.FC<BooksWidgetProps> = ({ books }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const router = useRouter();

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <div className="books-widget relative">
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
            className="font-telegrafico text-communist-red mt-0 mb-0 ml-3"
            variant="h5"
          >
            Books
          </Typography>
        </Link>
        <ButtonGroup
          sx={{
            boxShadow: 1,
            backgroundColor: lighten('#EAEAE2', 0.4),
            borderRadius: '40px',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handlePrevious}
            sx={
              {
                // width: '40px',
                // height: '40px',
                // padding: '8px',
                //  borderRadius: '40%'
              }
            }
          >
            <ArrowBackIos sx={{ marginLeft: '5px' }} fontSize="small" className="text-communist-red" />
          </IconButton>
          <StyledDivider orientation='vertical' variant='middle' />
          <IconButton
            onClick={handleNext}
            sx={
              {
                // width: '40px',
                // height: '40px',
                // padding: '8px',
                // borderRadius: '40%'
              }
            }
          >
            <ArrowForwardIos sx={{ marginLeft: '4px' }} fontSize="small" className="text-communist-red" />
          </IconButton>
        </ButtonGroup>
      </Box>
      <Swiper
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
          width: 'calc(100% + 20px)',
          height: 'calc(200px + 20px)',
          marginLeft: '-10px',
          padding: '5px 10px 10px 10px',
        }}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <Card elevation={0}
              sx={{
                maxWidth: '328px',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent'
              }}
            >
              <CardActionArea
                onClick={() => handleBookClick(book.id)}
                sx={{ height: '100%', padding: '8px' }}
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
                      width: '128px',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      marginRight: '8px',
                    }}
                  >
                    <Image
                      src={getImageUrl(book.featuredImage?.node, 128)}
                      alt={book.featuredImage?.node?.altText || book.title}
                      layout="fill" // Fills the container dimensions
                      objectFit="fill" // Ensures the image covers the entire box
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h6" className="font-helvetica">
                      {book.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      component="div"
                      className="font-helvetica"
                      sx={{ marginTop: '8px' }}
                    >
                      {book.bookDetails.subheading}
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BooksWidget;
