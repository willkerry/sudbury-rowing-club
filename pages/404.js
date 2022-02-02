import Head from "next/head";
import { Home, Search } from "react-feather";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Error 404</title>
      </Head>
      <HeroTitle prose title="Page not found." transparent />

      <Container className="mt-12 prose max-w-prose">
        <p>
          Sorry, we know link rot is really annoying, but this page isn’t here
          any more.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            as="a"
            icon={<Search />}
            variant="brand"
            href="https://www.google.com/search?q=site%3Asudburyrowingclub.org.uk"
          >
            Search our site with Google
          </Button>
          <Button as="a" icon={<Home />} href="/">
            Return to the homepage
          </Button>
        </div>
      </Container>
    </Layout>
  );
}
