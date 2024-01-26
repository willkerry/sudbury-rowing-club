import Script from "next/script";
import { DefaultSeo } from "next-seo";
import "../styles/index.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SEO from "../next-seo.config";
import "inter-ui/inter-variable.css";
import "@fontsource-variable/jetbrains-mono/index.css";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <DefaultSeo {...SEO} />
    <Script
      defer
      data-domain="sudburyrowingclub.org.uk"
      src="https://analytics.sudburyrowingclub.org.uk/js/script.js"
    />
    <Component {...pageProps} />
  </QueryClientProvider>
);

export default App;
