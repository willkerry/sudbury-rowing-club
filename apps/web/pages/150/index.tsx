import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { fetchArchives } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { HundredAndFiftyFireworks } from "@/components/anniversary/150-fireworks";
import { HundredAndFiftyGallery } from "@/components/anniversary/150-gallery";
import { HundredAndFiftyGradient } from "@/components/anniversary/150-gradient";
import { HundredAndFiftyLogo } from "@/components/anniversary/150-logo";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";

const TITLE = "150 Years of Rowing in Sudbury";
const DESCRIPTION = "Join us in celebrating 150 years of rowing in Sudbury";

export const getStaticProps = async () => ({
  props: { archives: await fetchArchives() },
});

const Join: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  archives,
}) => (
  <Layout>
    <NextSeo
      description={DESCRIPTION}
      openGraph={{
        description: DESCRIPTION,
        images: [
          {
            url: makeShareImageURL("150 Years 🍾", true, {
              subtitle: "1874–2024",
            }),
          },
        ],
        title: TITLE,
      }}
      title={TITLE}
    />

    <div className="relative isolate overflow-hidden bg-gray-900 py-4 text-white shadow-lg">
      <HundredAndFiftyFireworks />
      <HundredAndFiftyGradient size="lg" />

      <Container className="my-16">
        <HundredAndFiftyLogo />

        <h1 className="mx-auto mb-12 text-center text-3xl font-semibold text-white md:text-7xl">
          Join us in celebrating 150 years of rowing in Sudbury
        </h1>

        <div className="prose prose-invert mx-auto mb-6 text-blue-50">
          <p>
            Sudbury Rowing Club, formerly Stour Boat Club, was founded in 1874.
            This year, in celebration of the 150th anniversary of our
            foundation, we have created a space to share our history, our
            stories, and our memories. We invite you to join us in celebrating
            this milestone.
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/150/gallery">View the gallery</Link>
          </Button>

          <HundredAndFiftyContactButton />
        </div>
      </Container>
    </div>

    <div className="-mt-6">
      <HundredAndFiftyGallery archives={archives} />
    </div>

    <Container className="py-24">
      <div className="prose mx-auto rounded border p-4">
        <h2 className="text-lg">Contribute</h2>
        <p>
          We are collecting stories, photos, and memories from our members, past
          and present. If you have something you would like to contribute,
          please let us know.
        </p>

        <HundredAndFiftyContactButton />
      </div>
    </Container>
  </Layout>
);

export default Join;
