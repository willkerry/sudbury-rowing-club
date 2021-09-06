import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";
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
        <div className="grid grid-cols-1 gap-16 py-16 sm:grid-cols-2">
          <h2 className="text-6xl font-semibold tracking-tighter text-gray-800">
            Introducing the world’s shortest sprint course
          </h2>
          <div className="mt-2 prose">
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
        </div>
        <Image src={courseMap} alt="" />
      </Container>
    </Layout>
  );
}
