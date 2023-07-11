import { DefaultSeo } from "next-seo";
import "../styles/index.css";
import { AppProps } from "next/app";
import SEO from "../next-seo.config";
import "inter-ui/inter.css";
import "@fontsource/jetbrains-mono/variable.css";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo {...SEO} />
    <Component {...pageProps} />
  </>
);

export default App;
