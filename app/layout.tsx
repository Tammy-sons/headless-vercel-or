import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ReactNode, Suspense } from 'react';
import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE } = process.env;
const baseUrl = 'https://treenurseryco.com';


// const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
// const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Tree Nursery Co | Buy Trees, Shrubs & Plants Online',
    template: `%s | Tree Nursery Co`
  },
  description: 'Shop Tree Nursery Co for quality trees, shrubs, and plants shipped fresh to your door. Easy online ordering and trusted nursery expertise.',
  keywords: ['nursery', 'buy trees online', 'plants', 'shrubs', 'gardening'],
  alternates: {
    canonical: '/'
  },
  robots: {
    follow: true,
    index: true
  },
  icons: {
    icon: '/favicon.ico',
  },

  /*
  ...(twitterCreator &&
    twitterSite && {
    twitter: {
      card: 'summary_large_image',
      creator: twitterCreator,
      site: twitterSite
    }
  })
  */
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} style={{ colorScheme: 'light' }}>
      <body className="flex min-h-screen flex-col bg-neutral-50 text-black selection:bg-teal-300">
        <Script src="https://analytics.ahrefs.com/analytics.js" strategy="beforeInteractive" data-key="+szW6AN1qxsBO52rxmBpfA" async />
        <Navbar />
        <Suspense>
          <main className="flex-grow">
            {children}
          </main>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}