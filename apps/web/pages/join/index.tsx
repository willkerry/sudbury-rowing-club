import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import NextLink from "next/link";
import { ThumbsUp } from "lucide-react";
import { makeShareImageURL } from "@/lib/og-image";
import {
  JoinCTA,
  L2RCallToAction,
  L2RStages,
  Overview,
  SectionHeading,
} from "@/components/join";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import Note from "@/components/stour/note";
import { Button } from "@/components/ui/button";
import { l2rStages, overview } from "@/data/join/";

const HIDE_COURSE_AFTER_DATE = new Date(2024, 4, 28);

export const NextCourse = () => {
  const seasonStartDates: Record<string, Date> = {
    spring: new Date("2023-03-15"),
    summer: new Date("2023-06-15"),
    autumn: new Date("2023-09-15"),
    winter: new Date("2023-12-15"),
  };

  const expirySeason = Object.entries(seasonStartDates).find(
    ([, seasonStartDate]) =>
      HIDE_COURSE_AFTER_DATE.getTime() > seasonStartDate.getTime(),
  )?.[0];

  if (HIDE_COURSE_AFTER_DATE.getTime() < Date.now()) {
    return (
      <Note
        className="m-4 bg-white"
        type="success"
        label={`Our ${expirySeason} course has finished`}
      >
        Check back soon for details of our next course. Apply now to register
        your interest and be notified when the next course is announced.
      </Note>
    );
  }

  return (
    <div className="prose-sm rounded border border-green-200 bg-green-50 px-2 pb-1">
      <h3 className="mb-1 mt-2 flex items-center gap-1 text-base font-semibold">
        Course Dates
        <span className="mt-0.5 rounded-full bg-green-500 px-1 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          New
        </span>
      </h3>
      <p>
        Please <Link href="join/apply">register your interest</Link> for the
        Learn to Row course dates for 2024.
      </p>
      <p>
        First <strong>taster sessions</strong> being held:
        <div>3 February 2024, 11:30-13:00</div>
        <div>10 February 2024, 11:30-13:00</div>
      </p>
      <p className="mb-0">Followed by two separate courses:</p>
      <div className="grid gap-4 py-0 md:grid-cols-2">
        <div>
          <strong>Course 1 (Saturday 13:00-16:00)</strong>
          <div>2 March 2023</div>
          <div>9 March 2023</div>
          <div>16 March 2023</div>
          <div>23 March 2023</div>
        </div>

        <div>
          <strong>Course 2 (Saturday 13:00-16:00)</strong>
          <div>6 April 2023</div>
          <div>13 April 2023</div>
          <div>20 April 2023</div>
          <div>27 April 2023</div>
        </div>
      </div>
      <p>
        <Link href="join/apply">Register your interest</Link> now or{" "}
        <Link href="/contact?q=learntorow">contact Sean Moriarty</Link> for
        further information.
      </p>

      <p>We look forward to welcoming you to the club.</p>
    </div>
  );
};

const Join: NextPage = () => (
  <Layout>
    <NextSeo
      description="Everything you need to know about getting rowing."
      openGraph={{
        description: "Everything you need to know about getting rowing.",
        images: [{ url: makeShareImageURL("Start rowing 👍", true) }],
        title: "Start rowing at Sudbury Rowing Club",
      }}
      title="Start rowing at Sudbury Rowing Club"
    />
    {/* Big hero */}
    <Container className="py-16 text-center text-gray-900 sm:py-24" id="hero">
      <Label className="sm:mb-3">Join Sudbury Rowing Club</Label>
      <h1 className="relative z-10 text-6xl font-semibold tracking-tighter text-green-500 drop-shadow-xl sm:text-8xl">
        Start rowing with us{" "}
        <ThumbsUp className="inline h-12 w-12 rotate-3 text-blue-400 sm:h-16 sm:w-16" />
      </h1>
      <div
        className="z-0 mx-auto flex -rotate-2 overflow-hidden rounded shadow-xl"
        style={{ maxHeight: 160, maxWidth: 240 }}
      >
        <Image
          alt="Trainee rowers on the water during on learn to row course."
          height={160}
          src="/assets/join/l2r.jpg"
          width={240}
        />
      </div>
      <div className="prose mx-auto mb-16 mt-12 max-w-xl text-left">
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
        <div className="flex items-center rounded border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="w-full">
            <div className="mb-2 text-lg font-medium">
              Contact the club captain
            </div>
            <Button asChild size="lg">
              <NextLink href="/contact?q=captain">Contact</NextLink>
            </Button>
          </div>
        </div>
      </div>
    </Container>

    <Container className="my-40 flex items-center">
      <div className="flex-grow border-t border-gray-300" />
      <div className="mb-px px-4 text-lg font-medium leading-none">or</div>
      <div className="flex-grow border-t border-gray-300" />
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
              The programme costs £130 and for its duration, you’ll be a club
              member. The programme fee includes your first month’s adult
              membership to the club after which you will be given the option
              continue your membership at the adult rate of £32 per month
              thereafter.
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
  </Layout>
);

export default Join;
