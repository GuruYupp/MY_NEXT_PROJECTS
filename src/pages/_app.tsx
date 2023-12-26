import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Head from 'next/head';
import { Provider } from 'react-redux';
import Store from '@/redux/store';
import Script from 'next/script';
import NextNProgress from 'nextjs-progressbar';
import Layout from '@/layouts/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress
        color="#e7195a"
        showOnShallow={true}
        startPosition={0.3}
        options={{ showSpinner: false }}
      />
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1.0" />
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://cdn.jwplayer.com/libraries/MAaRkUjT.js"
        id="jw-player-script"
      >
        jwplayer.key = "jTL7dlu7ybUI5NZnDdVgb1laM8/Hj3ftIJ5Vqg==";
      </Script>
      <Provider store={Store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}
