import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import { makeShareImageURL } from "@/lib/og-image";

/**
 * A 'root'-level comonent for rendering simple pages with a title and some
 * HTML-like content. **Do not** wrap this component in a `Layout` component.
 */
const TextPage = ({
  children,
  title,
  description,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Layout>
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [{ url: makeShareImageURL(title, true) }],
      }}
    />
    <HeroTitle title={title} prose breadcrumbs />
    <Container>
      <div className="prose mx-auto my-16">{children}</div>
    </Container>
  </Layout>
);

export default TextPage;
