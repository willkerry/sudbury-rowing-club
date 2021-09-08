import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";
import { Home, Search } from "react-feather";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Error 404</title>
      </Head>
      <HeroTitle prose title="Page not found." transparent/>

      <Container className="mt-12 prose max-w-prose">
        <p>
          Sorry, we know link rot is really annoying, but this page isn’t here
          any more.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            iconLeft={<Search />}
            variant="brandDark"
            href="https://www.google.com/search?q=site%3Asudburyrowingclub.org.uk"
          >
            Search our site with Google
          </Button>
          <Button iconLeft={<Home />} href="/">Return to the homepage</Button>
        </div>
      </Container>
    </Layout>
  );
}
