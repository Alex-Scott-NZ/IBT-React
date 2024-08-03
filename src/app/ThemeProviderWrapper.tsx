"use client";

import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import theme from './theme'; // Path to your theme file

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
