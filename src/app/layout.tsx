import { Metadata } from 'next';
import './globals.css';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { ArticleProvider } from '../app/context/ArticleContext';
import { Cambay } from 'next/font/google';
import localFont from 'next/font/local';
import Head from 'next/head'; // Import Head from next/head

// Load Cambay font
const cambay = Cambay({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cambay',
});

// Load Telegrafico
const telegrafico = localFont({
  src: '../../public/fonts/telegrafico.woff2',
  variable: '--font-telegrafico',
});

// Load Helvetica Neue with all weights
const helveticaNeue = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNeueLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HelveticaNeueRoman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HelveticaNeueMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HelveticaNeueBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-neue',
});

export const metadata: Metadata = {
  title: 'International Bolshevik Tendency',
  description: 'We stand for a working-class revolution to overthrow capitalism on a global scale. Our vision is a world without hunger, war and oppression, in which all human beings may develop their full potential while protecting the environment on which we depend.'
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cambay.variable} ${telegrafico.variable} ${helveticaNeue.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ThemeProviderWrapper>
        <body className="bg-custom-bg font-helvetica">
          <div id="__next">
            <ArticleProvider>{children}</ArticleProvider>
          </div>
        </body>
      </ThemeProviderWrapper>
    </html>
  );
}
