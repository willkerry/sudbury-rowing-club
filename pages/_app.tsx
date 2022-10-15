import { DefaultSeo } from "next-seo";
import "../styles/index.css";
import Router from "next/router";
import { AppProps } from "next/app";
import ProgressBar from "@badrap/bar-of-progress";
import SEO from "../next-seo.config";
import "inter-ui/inter.css";
import "@fontsource/jetbrains-mono/variable.css";

const progress = new ProgressBar({
  size: 2,
  color: "#00418D",
  className: "prog-bar",
  delay: 100,
});
if (typeof window !== "undefined") {
  progress.start();
  progress.finish();
}

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", () => {
  progress.finish();
  window.scrollTo(0, 0);
});
Router.events.on("routeChangeError", progress.finish);

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo {...SEO} />
    <Component {...pageProps} />
  </>
);

export default App;
