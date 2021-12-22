import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import groq from "groq";
import NewsList from "@/components/news/news-list";
import { BASE_URL } from "@/lib/constants";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import sanityClient from "@/lib/sanity.server";

export default function News({ data }) {
  return (
    <Layout>
      <NextSeo
        title="News | Sudbury Rowing Club"
        description="Latest news from Sudbury Rowing Club."
        openGraph={{
          title: "Latest News",
          description: "Latest news from Sudbury Rowing Club.",
          images: [{ url: `${BASE_URL}/assets/og/news.png` }],
        }}
      />
      <div className="flex items-center py-6 border-t border-b">
        <Container>
          <Label className="max-w-prose">Latest News</Label>
          <h1 className="max-w-prose">
            For more updates, follow us on{" "}
            <Link href="https://facebook.com/sudburyrowing">Facebook</Link>.
          </h1>
        </Container>
      </div>
      <Container className="my-10">
        <NewsList postData={data} />
      </Container>
    </Layout>
  );
}

News.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      date: PropTypes.string.isRequired,
      featuredImage: PropTypes.shape({
        alt: PropTypes.string,
        caption: PropTypes.string,
        _id: PropTypes.string.isRequired,
        lqip: PropTypes.string.isRequired,
        aspectRatio: PropTypes.number.isRequired,
      }),
    })
  ),
};

News.defaultProps = {
  data: [
    {
      excerpt: null,
      featuredImage: false,
    },
  ],
};

export async function getStaticProps() {
  const data = await sanityClient.fetch(groq`
    *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
        _id,
        "slug": slug.current,
        title,
        excerpt,
        date,
        featuredImage {
          alt, 
          caption,
          "_id": @.image.asset->_id, 
          "lqip": @.image.asset->metadata.lqip, 
          "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio
        },
      }
   `);

  return {
    props: { data },
    revalidate: 7200,
  };
}
