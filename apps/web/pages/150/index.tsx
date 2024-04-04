import { NextSeo } from "next-seo";
import Link from "next/link";
import Fireworks from "@fireworks-js/react";
import { makeShareImageURL } from "@/lib/og-image";
import { Numeral } from "@/components/anniversary/numeral";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Crest from "@/components/logo/crest";
import { Button } from "@/components/ui/button";

const TITLE = "150 Years of Rowing in Sudbury";
const DESCRIPTION = "Join us in celebrating 150 years of rowing in Sudbury";

const Join = () => (
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

    <div className="relative mb-12 bg-blue-900 py-4 text-blue-50">
      <Fireworks
        className="absolute inset-0"
        options={{
          hue: { min: 205, max: 220 },
          sound: { enabled: false },
          intensity: 5,
        }}
      />

      <Container className="my-16">
        <div className="my-16 flex flex-col items-center justify-center gap-4">
          <Crest className="z-10 w-20" />
          <Numeral className="z-10" />
        </div>

        <h1 className="mx-auto mb-12 text-center text-7xl font-light text-white">
          Join us in celebrating 150 years of rowing in Sudbury.
        </h1>

        <div className="prose mx-auto mb-6 text-blue-50">
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
        </div>
      </Container>
    </div>
  </Layout>
);

export default Join;
