import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import { BASE_URL } from "@/lib/constants";

/**
 * A 'root'-level comonent for rendering simple pages with a title and some
 * HTML-like content. **Do not** wrap this component in a `Layout` component.
 */
const TextPage: React.FC<{
  title: string;
  description?: string;
  ogImage?: string;
  children: React.ReactNode;
}> = ({ children, title, description, ogImage }) => (
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
