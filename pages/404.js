import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Error 404</title>
      </Head>
      <HeroTitle title="404: We seem to have lost that page." />

      <Container className="mt-6 prose">
        <p className="lead">Sorry, we know link rot is really annoying.</p>
        <p>
          Scroll down to the footer and peruse our sitemap to see if you can
          find what{" "}
          <span>
            <Button size="mini">Back to the sitemap</Button>
          </span>{" "}
          you’re looking for, or else try a Google search.
        </p>

        <p>
          If you’re sure there ought to be a page here, send Will a message.
        </p>
      </Container>
    </Layout>
  );
}
