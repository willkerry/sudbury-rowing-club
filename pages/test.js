import Head from "next/head";
import Container from "@/components/container";
import Layout from "@/components/layout";

import { groq } from "next-sanity";
import { urlFor, PortableText } from "@/lib/sanity";
import { sanityClient } from "@/lib/sanity.server";

const pageQuery = groq`

  *[_type == "regattaSettings"]{
  title,
  date,
  landingPage {
    description,
    heroImage {
      heading,
      subheading,
        image {
          'url':  asset->url,
          'aspectRatio': asset->metadata.dimensions.aspectRatio,
          'lqip': asset->metadata.lqip
        }
    },
    images,
    tagline
  },
  note,
  competitorInformation { 
    description,
   	documents[]
		{	title,
     	"extension": asset->extension,
     	"url": asset->url
    }
	},
	courseMap
	{
    heading,
    description,
    "coursemap": map.asset->url,
    mapImage {
   'url':  asset->url,
   'aspectRatio': asset->metadata.dimensions.aspectRatio,
    'lqip': asset->metadata.lqip
  }
	},
	entries,
	results,
  events
}[0]
`; 

export default function Test({ data }) {
  return (
    <Layout>
      <Head>
        <title>Test</title>
      </Head>
      <Container className="mt-12 prose max-w-prose">
        Hello World
        <PortableText blocks={data.landingPage.description} />
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const data = await sanityClient.fetch(pageQuery);

  return {
    props: {
      data,
    },
  };
}
