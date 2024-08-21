import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { HundredAndFiftyFireworks } from "@/components/anniversary/150-fireworks";
import { HundredAndFiftyGradient } from "@/components/anniversary/150-gradient";
import { HundredAndFiftyLogo } from "@/components/anniversary/150-logo";
import Container from "@/components/layouts/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/create-metadata";
import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "150 Years of Rowing in Sudbury";
const DESCRIPTION = "Join us in celebrating 150 years of rowing in Sudbury";

export const metadata: Metadata = {
  ...createMetadata({
    title: TITLE,
    description: DESCRIPTION,
    image: {
      title: "150 Years 🍾",
      subtitle: "1874–2024",
    },
  }),
};

const Join = () => (
  <>
    <div className="relative isolate overflow-hidden bg-gray-900 py-4 text-white shadow-lg">
      <HundredAndFiftyFireworks />
      <HundredAndFiftyGradient size="lg" />

      <Container className="my-16">
        <HundredAndFiftyLogo />

        <h1 className="mx-auto mb-12 mt-20 text-center text-3xl font-semibold text-white md:text-7xl">
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

          <HundredAndFiftyContactButton
            variant="link"
            className="text-white"
            message={`I'd like to contribute to the 150th anniversary gallery.\n\nNOTE: It isn't possible to attach images to this form: we'll provide a secure way to share them after you send this message.\n\nYour message: `}
          >
            Contribute
          </HundredAndFiftyContactButton>
        </div>
      </Container>
    </div>

    <div className="-mt-6" />
  </>
);

export default Join;
