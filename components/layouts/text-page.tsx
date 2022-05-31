import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import { BASE_URL } from "@/lib/constants";

type Props = {
  title: string;
  description?: string;
  ogImage?: string;
  children: React.ReactNode;
};

const TextPage = ({ children, title, description, ogImage }: Props) => (
  <Layout>
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [{ url: BASE_URL + ogImage }],
      }}
    />
    <HeroTitle title={title} prose breadcrumbs />
    <Container>
      <div className="mx-auto my-16 prose">{children}</div>
    </Container>
  </Layout>
);

export default TextPage;
