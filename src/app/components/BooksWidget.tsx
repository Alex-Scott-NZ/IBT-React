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
} from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './BooksWidget.module.css';

interface BooksWidgetProps {
  books: Book[];
}

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={handlePrevious}
            className={`${styles.customPrevButton} text-communist-red`}
            sx={{
              width: '40px',
              height: '40px',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            className={`${styles.customNextButton} text-communist-red`}
            sx={{
              width: '40px',
              height: '40px',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
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
            <Card
              sx={{
                maxWidth: '328px',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
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
                    <img
                      src={getImageUrl(book.featuredImage?.node, 128)}
                      alt={book.featuredImage?.node?.altText || book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <Typography
                      variant="h6"
                      className="font-helvetica"
     
                    >
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
