import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";
import { BASE_URL } from "@/lib/constants";
import { NextSeo } from "next-seo";
import Image from "next/image";
import courseMap from "public/assets/regatta/course/course-map.jpg";
import { Download } from "react-feather";

export default function Photography({ preview }) {
  return (
    <Layout preview={preview}>
      <NextSeo
        title="Coursemap | Sudbury Regatta"
        description="Sudbury’s challenging regatta course."
        openGraph={{
          title: "Coursemap",
          description: "The Sudbury Regatta’s challenging regatta course.",
          images: [{ url: BASE_URL + "/assets/og/course.png" }],
        }}
      />
      <HeroTitle title="Sudbury Regatta Course" breadcrumbs />
      <Container className="mb-16">
        <div className="my-16 prose">
          <p className="lead">Introducing the world’s shortest sprint course</p>
          <p>
            All boats other than the sprint eights race on the 650m course at
            Sudbury, beginning at stake-boats before the bend and finishing at
            the shared finish. Eights race on the straighter 350m course –
            possibly the shortest of its kind anywhere in the world – avoiding
            the tight bend and making for very exciting racing indeed.
          </p>
          <Button
            href="/assets/regatta/course/course-map.pdf"
            iconRight={<Download />}
          >
            Download the PDF
          </Button>
        </div>
        <div className="flex overflow-hidden border rounded shadow-xl">
          <Image src={courseMap} alt="" />
        </div>
      </Container>
    </Layout>
  );
}
