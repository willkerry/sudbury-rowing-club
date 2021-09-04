import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import "../styles/index.css";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

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

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
}
