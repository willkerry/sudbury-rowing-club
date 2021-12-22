import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import { BASE_URL } from "@/lib/constants";

export default function TextPage({ title, description, ogImage, children }) {
  return (
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
}

TextPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ogImage: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
