import Head from "next/head";
import { Home, Search } from "react-feather";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>Error 500</title>
      </Head>
      <HeroTitle prose title="Something went wrong." transparent />
      <Container className="mt-12 prose max-w-prose">
        <div className="flex flex-col gap-4">
          <Button
            iconLeft={<Search />}
            variant="brandDark"
            href="https://www.google.com/search?q=site%3Asudburyrowingclub.org.uk"
          >
            Search our site with Google
          </Button>
          <Button iconLeft={<Home />} href="/">
            Return to the homepage
          </Button>
        </div>
        <div className="h-12"/>
        <code>Error 500</code>
      </Container>
    </Layout>
  );
}
