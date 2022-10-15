import Head from "next/head";
import { Home, Search } from "react-feather";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
import Image from "next/image";

const Custom404 = () => (
  <Layout>
    <Head>
      <title>Error 404</title>
    </Head>
    <HeroTitle prose title="404 Page not found." transparent />

    <div className="flex justify-center">
      <Image
        alt="The time the river ran dry."
        className="rounded-sm"
        height={144}
        src="/assets/error/trouble-at-tmill.jpg"
        width={192}
      />
    </div>

    <Container className="mt-12 prose max-w-prose">
      <p>
        The page you are looking for might have been removed, or might have just
        moved.
      </p>
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
    </Container>
  </Layout>
);

export default Custom404;
