import { Home, Search } from "react-feather";
import Head from "next/head";
import Image from "next/image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
import HeroTitle from "@/components/stour/hero/hero-title";

const Custom500 = () => (
  <Layout>
    <Head>
      <title>Error 500</title>
    </Head>

    <HeroTitle prose title="Something went wrong." transparent />

    <div className="flex justify-center">
      <Image
        alt="The time the river ran dry."
        className="rounded-lg"
        height={144}
        src="/assets/error/trouble-at-tmill.jpg"
        width={192}
      />
    </div>

    <Container className="prose mt-12 max-w-prose">
      <div className="flex flex-col gap-4">
        <Button
          as="a"
          href="https://www.google.com/search?q=site%3Asudburyrowingclub.org.uk"
          icon={<Search />}
          variant="brand"
        >
          Search our site with Google
        </Button>
        <Button as="a" href="/" icon={<Home />}>
          Return to the homepage
        </Button>
      </div>
      <div className="h-12" />

      <code>Error 500</code>
    </Container>
  </Layout>
);

export default Custom500;
