import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Script from "next/script";
import "@fontsource-variable/jetbrains-mono/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "inter-ui/inter-variable.css";
import { Toaster } from "@/components/ui/sonner";
import SEO from "../next-seo.config";
import "../styles/index.css";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

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

    <Toaster />

    {process.env.NODE_ENV === "development" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default App;
