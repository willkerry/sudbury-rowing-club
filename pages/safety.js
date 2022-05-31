import { Download, ExternalLink } from "react-feather";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import { BASE_URL } from "lib/constants";
import groq from "groq";
import SafetyPopup from "@/components/safety";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import sanityClient from "@/lib/sanity.server";
import Text from "@/components/stour/text";
import Button from "@/components/stour/button";

function SectionTitle({ children }) {
  return (
    <h2 className="mb-8 text-xl font-bold tracking-tight text-gray-800 md:pr-6">
      {children}
    </h2>
  );
}
SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};
export default function Safety({ safety, safetyStatus }) {
  return (
    <Layout>
      <NextSeo
        title="Safety | Sudbury Rowing Club"
        description="Rowing safely at Sudbury Rowing Club."
        openGraph={{
          title: "Safety",
          description: "Rowing safely at Sudbury Rowing Club.",
          images: [{ url: `${BASE_URL}/assets/og/safety.png` }],
        }}
      />
      <HeroTitle prose title="Safety" />
      <Container className="mx-auto my-12 space-y-16 max-w-prose">
        {safetyStatus.display && (
          <div className="overflow-hidden border rounded">
            <SafetyPopup
              description={safetyStatus.description}
              date={safetyStatus._updatedAt}
              status={safetyStatus.status}
            />
          </div>
        )}
        {safety.map((item) => (
          <div key={item._id} id={item._id} className="space-y-6">
            <SectionTitle>{item.title}</SectionTitle>
            {item.body && <Text portableText={item.body} />}
            {item.__updatedAt}
            {item.link && (
              <Button
                href={item.link.url}
                as="a"
                icon={
                  item.link.url.includes(BASE_URL) ? (
                    <Download />
                  ) : (
                    <ExternalLink />
                  )
                }
              >
                {item.link.title}
              </Button>
            )}
            {item.document && (
              <Button
                as="a"
                href={`${item.document.url}?dl=`}
                icon={<Download />}
              >
                {item.document.title}
              </Button>
            )}
          </div>
        ))}
      </Container>
    </Layout>
  );
}

Safety.propTypes = {
  safety: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.node,
      ]),
      link: PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
      document: PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
  safetyStatus: PropTypes.shape({
    _updatedAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    display: PropTypes.bool.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`{
      "safety": *[_type == "safety" && !(_id in path("drafts.**"))] | order(_updatedAt asc){
        _updatedAt,
        _id,
        title,
        body[]{
          ...,
          _type == "figure" => {
            "_id": @.image.asset->_id,       
            "altText": @.image.asset->altText,
            "description": @.image.asset->description,   
            "lqip": @.image.asset->metadata.lqip,
            "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio, 
          },
        },
        document != null => {
          document {
            title,
            "url": asset->url,
            "extension": asset->extension,
          },
        },
        link != null => { link },
      },
      "safetyStatus": *[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
        _updatedAt,
        description,
        display,
        status
      } 
    }`
  );
  return {
    props: {
      safety: data.safety,
      safetyStatus: data.safetyStatus,
    },
  };
};
