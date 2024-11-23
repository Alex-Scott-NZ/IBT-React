"use client";

import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ignoreScrollEvents = useRef(false);
  const lastScrollY = useRef(0);
  const MINIMUM_SCROLL_DELTA = 5; // Adjust this value as needed

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const bottomOffset = 500; // Adjust this value as needed

      const isAtTop = scrollY === 0;
      const isNearBottom = scrollY + clientHeight >= scrollHeight - bottomOffset;

      // Hide the button when at the top of the page
      if (isAtTop) {
        if (isVisible) {
          setIsVisible(false);
          // No need to set ignoreScrollEvents here
        }
        lastScrollY.current = scrollY;
        return;
      }

      // Show the button when near the bottom, regardless of scroll direction
      if (isNearBottom) {
        if (!isVisible) {
          setIsVisible(true);
          // No need to set ignoreScrollEvents here
        }
        lastScrollY.current = scrollY;
        return;
      }

      // Ignore scroll events if the flag is set
      if (ignoreScrollEvents.current) {
        return;
      }

      const scrollDelta = scrollY - lastScrollY.current; // Positive if scrolling down

      // Only update visibility on significant scrolls elsewhere
      if (scrollDelta > MINIMUM_SCROLL_DELTA) {
        // User scrolled down significantly
        if (isVisible) {
          setIsVisible(false);
          // Start ignoring scroll events for 1 second
          ignoreScrollEvents.current = true;
          setTimeout(() => {
            ignoreScrollEvents.current = false;
          }, 1000);
        }
        lastScrollY.current = scrollY;
      } else if (scrollDelta < -MINIMUM_SCROLL_DELTA) {
        // User scrolled up significantly
        if (!isVisible) {
          setIsVisible(true);
          // Start ignoring scroll events for 1 second
          ignoreScrollEvents.current = true;
          setTimeout(() => {
            ignoreScrollEvents.current = false;
          }, 1000);
        }
        lastScrollY.current = scrollY;
      } else {
        // No significant scroll, do nothing
        // Do not update isVisible or lastScrollY.current
      }
    };

    // Throttle the scroll handler for performance
    const throttledHandleScroll = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledHandleScroll);

    // Initial setup
    lastScrollY.current = window.scrollY || window.pageYOffset;

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [isVisible]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[1108px] px-2 transition-opacity ${
        isVisible
          ? 'opacity-100 duration-200'
          : 'opacity-0 duration-500 pointer-events-none'
      }`}
    >
      <div className="flex justify-end">
        <div className="mr-4 nav:mr-[20%]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 bg-communist-red text-white shadow-lg md:hover:bg-red-700 focus:outline-none border-none rounded-none"
            aria-label="Scroll to top"
          >
            <ArrowUpwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
