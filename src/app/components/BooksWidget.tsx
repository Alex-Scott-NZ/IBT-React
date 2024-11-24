"use client";

import React, { useState, useCallback } from "react";
import { GetBooksQuery } from "../../gql/gql-generated";
import { getImageUrl } from "../utils/imageHelpers";
import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";


interface BooksWidgetProps {
  books: GetBooksQuery;
}

const BooksWidget: React.FC<BooksWidgetProps> = ({ books }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const router = useRouter();

  const handlePrevious = useCallback(
    (event: React.MouseEvent) => {
      event?.stopPropagation();
      swiperRef?.slidePrev();
    },
    [swiperRef]
  );

  const handleNext = useCallback(
    (event: React.MouseEvent) => {
      event?.stopPropagation();
      swiperRef?.slideNext();
    },
    [swiperRef]
  );

  const handleBookClick = (bookSlug: string) => {
    router.push(`/book/${bookSlug}`);
  };

  const booksList = books?.books?.nodes || [];

  return (
    <div className="books-widget relative mb-4">
      <div className="mb-2 flex justify-between items-center">
        <Link href="/book" passHref>
          <h5 className="font-telegrafico text-gray-900 mt-0 mb-0 text-xl font-light hover:bg-gray-400/5 transition-colors">
            Books
          </h5>
        </Link>
      </div>
      <Swiper
        className="p-0"
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
      >
        {booksList.map((book) => (
          <SwiperSlide key={book.id}>
            <div
              className="w-full flex flex-col bg-transparent cursor-pointer transition-colors hover:bg-gray-400/10"
              onClick={() => book.slug && handleBookClick(book.slug)}
            >
              <div className="flex items-start">
                {/* Image Container */}
                <div className="w-1/3 relative flex-shrink-0 mr-2">
                  <Image
                    src={getImageUrl(book.featuredImage?.node, 128)}
                    alt={book.featuredImage?.node?.altText || book.title || ""}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                {/* Text Container */}
                <div className="flex-1">
                  <h6 className="font-helvetica text-sm text-grey-600 font-bold m-0">
                    {book.title}
                  </h6>
                  <p className="font-helvetica text-xs text-gray-600 m-0">
                    {book.bookDetails?.subheading}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-0 flex justify-center items-center">
        <div className="flex w-full max-w-xs">
          <button
            onClick={handlePrevious}
            className="flex-1 flex justify-center items-center p-2 rounded-l-full border-0 focus:outline-none transition-colors hover:bg-gray-400/10 bg-transparent"
          >
            <ArrowBackIos fontSize="small" className="text-communist-red" />
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex justify-center items-center p-2 rounded-r-full border-0 focus:outline-none transition-colors hover:bg-gray-400/10 bg-transparent"
          >
            <ArrowForwardIos fontSize="small" className="text-communist-red" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default React.memo(BooksWidget);
