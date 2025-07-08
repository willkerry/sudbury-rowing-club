import {
  JoinCTA,
  L2RCallToAction,
  L2RStages,
  Overview,
  SectionHeading,
} from "@/components/join";
import { Container } from "@/components/layouts/container";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { Button } from "@/components/ui/button";
import { l2rStages, overview } from "@/data/join/";
import { createMetadata } from "@/lib/create-metadata";
import { scrapeRatesTable } from "@/lib/scrapeRatesTable";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { NextCourse } from "./next-course";

import JoinImage from "@/assets/join/l2r.jpg";

export const metadata = createMetadata({
  title: "Start rowing at Sudbury Rowing Club",
  description: "Everything you need to know about getting rowing.",
  image: {
    title: "Start rowing 👍",
  },
});

const getLearnToRowCourseCost = async () => {
  const rates = await scrapeRatesTable();

  if (rates.status === "error") {
    return null;
  }

  const learnToRowCourse = rates.data
    ?.filter((rate) => rate.Name.toLowerCase().includes("learn"))
    .sort((a, b) => a.Cost.InclTax.Value - b.Cost.InclTax.Value)
    .reverse()[0];

  if (!learnToRowCourse) return null;

  const learnToRowCourseCost = learnToRowCourse.Cost.InclTax.Value;

  if (!learnToRowCourseCost) return null;

  return Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(learnToRowCourseCost);
};

const templateLearnToRowCourseCost = (cost: string | null) =>
  cost
    ? `The programme costs ${cost} and for its duration, you’ll be a club member.`
    : "For the duration of the programme, you’ll be a club member.";

const Join = async () => (
  <>
    {/* Big hero */}
    <Container className="py-16 text-center text-gray-900 sm:py-24" id="hero">
      <Label className="sm:mb-3">Join Sudbury Rowing Club</Label>
      <h1 className="relative z-10 font-semibold text-6xl text-green-500 tracking-tighter drop-shadow-xl sm:text-8xl">
        Start rowing with us{" "}
        <ThumbsUp className="inline h-12 w-12 rotate-3 text-blue-400 sm:h-16 sm:w-16" />
      </h1>
      <div className="-rotate-2 z-0 mx-auto flex max-h-[160px] max-w-[240px] overflow-hidden rounded-sm shadow-xl">
        <Image
          alt="Trainee rowers on the water during on learn to row course."
          height={160}
          placeholder="blur"
          src={JoinImage}
          width={240}
        />
      </div>
      <div className="prose mx-auto mt-12 mb-16 max-w-xl text-left">
        <p className="lead">
          Sudbury Rowing Club welcomes new members
          <span className="whitespace-nowrap"> –</span> whether you’ve never
          rowed before and are seeking a new activity, or have rowed in the past
          and would like to return to the sport.
        </p>
        <p>
          We have two routes to club membership and only one essential criterion
          – that you can swim 50m.
        </p>
      </div>
      <JoinCTA />
    </Container>

    <Container id="experienced">
      <SectionHeading
        label="Join as an experienced rower"
        title="Have you rowed before?"
      />
      <div className="mb-20 grid gap-12 md:grid-cols-2">
        <div className="prose">
          <p className="lead">
            If you’ve rowed before, you can join the club immediately.
          </p>
          <p>
            You’ll need to complete a short application form on our membership
            portal. We offer a considerable variety of membership rates (e.g.
            short term, student, family, etc.) and you can find out more about
            these{" "}
            <Link href="/members/membership-rates">on our membership page</Link>
            .
          </p>
          <p className="font-medium">
            Your first step should be to contact the club captain.
          </p>
        </div>
        <div className="flex items-center rounded-sm border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="w-full">
            <div className="mb-2 font-medium text-lg">
              Contact the club captain
            </div>
            <Button asChild size="lg">
              <NextLink href="./contact?q=captain">Contact</NextLink>
            </Button>
          </div>
        </div>
      </div>
    </Container>

    <Container className="my-40 flex items-center">
      <div className="grow border-gray-300 border-t" />
      <div className="mb-px px-4 font-medium text-lg leading-none">or</div>
      <div className="grow border-gray-300 border-t" />
    </Container>

    {/* About the L2R course */}
    <div className="my-24" id="l2r">
      <Container>
        <SectionHeading
          label="Learn to row with us"
          title="Getting started in rowing couldn’t be easier"
        />

        <div className="mb-20 grid gap-12 md:grid-cols-2">
          <div className="prose">
            <p className="lead">
              Our Learn to Row progamme starts with a ‘taster session’ after
              which you can apply for a place on one of our courses during which
              you will learn the basics of sculling (an oar in each hand) over
              approximately 4 × 3-hour sessions.
            </p>
            <p>
              We plan to run the Learn to Row programme on a group basis for
              adults over the next year. Attending a taster session is an
              opportunity to find out about rowing and the course. You don’t
              have to make a commitment to the course until after the taster
              session when you can apply for a place on one of the upcoming
              courses. Subject to availability you will be allocated a start
              date along with a number of other participants at a similar level.
              Juniors (under 18) will be separately invited to programmed
              courses.
            </p>
            <p>
              {templateLearnToRowCourseCost(await getLearnToRowCourseCost())}{" "}
              The programme fee includes your first month’s adult membership to
              the club after which you will be given the option to continue your
              membership at the adult rate of £32 per month.
            </p>
          </div>
          <div className="flex items-center">
            <NextCourse />
          </div>
        </div>

        <L2RStages stages={l2rStages} />
        <L2RCallToAction />
      </Container>
    </div>
    <Container className="text-gray-800" id="overview">
      <SectionHeading
        label="What to expect"
        title="What can you do at Sudbury Rowing Club?"
      />
      <Overview items={overview} />
      <L2RCallToAction />
    </Container>
  </>
);

export default Join;
