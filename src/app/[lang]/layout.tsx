// app/[lang]/layout.tsx
import { Metadata } from 'next';
import '../globals.css'; // Note the path change
import ThemeProviderWrapper from '../ThemeProviderWrapper'; // Note the path change
import { ArticleProvider } from '../context/ArticleContext'; // Note the path change
import { Cambay } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import Providers from '../providers'; // Note the path change

const cambay = Cambay({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cambay',
});

const telegrafico = localFont({
  src: '../../../public/fonts/telegrafico.woff2', // Note the path change
  variable: '--font-telegrafico',
});

const helveticaNeue = localFont({
  src: [
    {
      path: '../../../public/fonts/HelveticaNeueLight.woff2', // Note the path change
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueRoman.woff2', // Note the path change
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueMedium.woff2', // Note the path change
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/HelveticaNeueBold.woff2', // Note the path change
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-neue',
});

export const metadata: Metadata = {
  title: 'International Bolshevik Tendency',
  description:
    'We stand for a working-class revolution to overthrow capitalism on a global scale. Our vision is a world without hunger, war and oppression, in which all human beings may develop their full potential while protecting the environment on which we depend.',
};

export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: 'no',
});

export default function LocaleLayout({
  children,
  params: { lang }, // Add the lang parameter
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html
      lang={lang} // Use the lang parameter instead of hardcoded "en"
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

      {/* Microsoft Clarity Script */}
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