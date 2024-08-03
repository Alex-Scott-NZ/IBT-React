// src/app/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';
import { Cambay } from 'next/font/google';

const cambay = Cambay({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: cambay.style.fontFamily,
  },
});

export default theme;
