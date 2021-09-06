import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import { BASE_URL } from "@/lib/constants";
import { NextSeo } from "next-seo";

export default function TextPage({ title, description, ogImage, children }) {
  return (
    <Layout>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title: title,
          description: description,
          images: [{ url: BASE_URL + ogImage }],
        }}
      />
      <HeroTitle title={title} prose breadcrumbs />
      <Container>
        <div className="mx-auto my-16 prose">{children}</div>
      </Container>
    </Layout>
  );
}
