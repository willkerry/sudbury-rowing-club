import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";

export default function TextPage({ title, children }) {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <HeroTitle title={title} prose breadcrumbs/>
      <Container>
        <div className="mx-auto my-16 prose">{children}</div>
      </Container>
    </Layout>
  );
}
