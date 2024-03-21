import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-datepicker/dist/react-datepicker.css";

import Head from "next/head";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Script from "next/script";
import NextNProgress from "nextjs-progressbar";
import Layout from "@/layouts/Layout";
import appConfig from "@/app.config";

const NPColor = () => {
  const product = appConfig.endPoints.product;
  switch (product) {
    case "herogotv":
      return "#0ccdd7";
    case "timesplay":
      return "#e7195a";
    case "firstshows":
      return "#d99200";
    case "reeldrama":
      return "#eb3495";
    case "dishtv":
      return "#e7195a";
    default:
      return "#ffff";
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress
        color={NPColor()}
        showOnShallow={true}
        startPosition={0.3}
        options={{ showSpinner: false }}
      />
      <Head>
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          name="viewport"
        ></meta>
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
