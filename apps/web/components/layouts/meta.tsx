import Head from "next/head";

/**
 * Provides boring meta tags for the page.
 */
const Meta = () => (
  <Head>
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/favicon/apple-touch-icon.png?v=3"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicon/favicon-32x32.png?v=3"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/favicon/favicon-16x16.png?v=3"
    />
    <link rel="manifest" href="/favicon/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/favicon/safari-pinned-tab.svg?v=3"
      color="#00295A"
    />
    <link rel="icon" href="/favicon/favicon.ico?v=3" />
    <meta name="msapplication-TileColor" content="#00295A" />
    <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
    {/* <meta name="theme-color" content="#00295A" /> */}
    <meta name="theme-color" content="#fff" />
  </Head>
);

export default Meta;
