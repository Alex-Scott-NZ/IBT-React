import { Metadata } from 'next';
import './globals.css';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { ArticleProvider } from '../app/context/ArticleContext'; // Ensure path is correct

export const metadata: Metadata = {
  title: 'International Bolshevik Tendency',
  description: 'Description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderWrapper>
          <ArticleProvider>{children}</ArticleProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
