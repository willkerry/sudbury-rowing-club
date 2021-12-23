import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
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
  description: PropTypes.string,
  ogImage: PropTypes.string,
  children: PropTypes.node.isRequired,
};

TextPage.defaultProps = {
  description: null,
  ogImage: null,
};
