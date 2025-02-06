import { Metadata } from 'next';
import '../globals.css';
import ThemeProviderWrapper from '../ThemeProviderWrapper';
import { ArticleProvider } from '../context/ArticleContext';
import { Cambay } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import Providers from '../providers';

const cambay = Cambay({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cambay',
  // Add display swap for better font loading performance
  display: 'swap',
});

const telegrafico = localFont({
  src: '../../../public/fonts/telegrafico.woff2',
  variable: '--font-telegrafico',
  // Add display swap for better font loading performance
  display: 'swap',
});

const helveticaNeue = localFont({
  src: [
    {
      path: '../../../public/fonts/HelveticaNeueLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueRoman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-neue',
  // Add display swap for better font loading performance
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'International Bolshevik Tendency',
  description:
    'We stand for a working-class revolution to overthrow capitalism on a global scale. Our vision is a world without hunger, war and oppression, in which all human beings may develop their full potential while protecting the environment on which we depend.',
  // Add viewport metadata
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  },
  // Add additional metadata for performance
  formatDetection: {
    telephone: false,
  },
  // Disable translateable header
  other: {
    'google': 'notranslate',
  }
};

// Remove separate viewport generator since it's in metadata
export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html
      lang={lang}
      className={`${cambay.variable} ${telegrafico.variable} ${helveticaNeue.variable}`}
    >
      <Providers>
        <ThemeProviderWrapper>
          <body className="bg-custom-bg font-helvetica">
            <div id="__next">
              <ArticleProvider>{children}</ArticleProvider>
            </div>
          </body>
        </ThemeProviderWrapper>
      </Providers>

      {/* Microsoft Clarity Script - moved to bottom for better performance */}
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "pkvgof32mr");
          `,
        }}
      />
    </html>
  );
}