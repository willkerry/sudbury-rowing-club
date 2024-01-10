import Script from "next/script";
import { DefaultSeo } from "next-seo";
import "../styles/index.css";
import { AppProps } from "next/app";
import SEO from "../next-seo.config";
import "inter-ui/inter-variable.css";
import "@fontsource/jetbrains-mono/variable.css";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo {...SEO} />
    <Script
      defer
      data-domain="sudburyrowingclub.org.uk"
      src="https://analytics.sudburyrowingclub.org.uk/js/script.js"
    />
    <Component {...pageProps} />
  </>
);

export default App;
