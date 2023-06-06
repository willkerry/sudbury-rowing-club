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
import { l2rStages, overview } from "@/data/join/";
import { BASE_URL } from "@/lib/constants";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { ThumbsUp } from "react-feather";

export const NextCourse = () => {
  const EXPIRY = new Date(2023, 4, 8);

  const seasonStartDates: Record<string, Date> = {
    spring: new Date("2023-03-15"),
    summer: new Date("2023-06-15"),
    autumn: new Date("2023-09-15"),
    winter: new Date("2023-12-15"),
  };

  const expirySeason = Object.entries(seasonStartDates).find(
    ([, seasonStartDate]) => EXPIRY.getTime() > seasonStartDate.getTime()
  )?.[0];

  if (EXPIRY.getTime() < Date.now()) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-green-50">
        <Note
          className="m-4 bg-white"
          type="success"
          label={`Our ${expirySeason} course has finished`}
        >
          Check back soon for details of our next course. Register your interest
          and be notified when the next course is announced.
        </Note>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-1 mt-2 flex items-center gap-1 text-base">
        Course Dates
        <span className="mt-0.5 rounded-full bg-green-500 px-1 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          New
        </span>
      </h3>
      <p>
        The next two adult Learn to Row courses will be held this spring 2023.
        These will be run on consecutive Saturday afternoons between 1pm and 4pm
        at Sudbury Rowing Club in Quay Lane, Sudbury (although please see note
        below about the Coronation weekend). Dates will be as follows:
      </p>
      <p>
        We’re holding two Saturday <strong>taster sessions</strong>:
        <div>4 February 2023, 12:30</div>
        <div>11 February 2023, 12:30</div>
      </p>
      <p className="mb-0">Followed by two separate courses:</p>
      <div className="grid gap-4 py-0 md:grid-cols-2">
        <div>
          <strong>Course 1</strong>
          <div>4 March 2023</div>
          <div>11 March 2023</div>
          <div>18 March 2023</div>
          <div>25 March 2023</div>
        </div>

        <div>
          <strong>Course 2</strong>
          <div>15 April 2023</div>
          <div>22 April 2023</div>
          <div>29 April 2023</div>
          <div>7 or 8 May 2023 (Coronation weekend)</div>
        </div>
      </div>
      <p>
        Please <Link href="join/apply">apply now</Link> or{" "}
        <Link href="/contact?to=KKEVTdAyelAe2LPMRqxXjF">
          contact Sean Moriarty
        </Link>{" "}
        for further information and booking instructions.
      </p>
    </>
  );
};

const Join: NextPage = () => (
  <Layout>
    <NextSeo
      description="Everything you need to know about getting rowing."
      openGraph={{
        description: "Everything you need to know about getting rowing.",
        images: [{ url: `${BASE_URL}/assets/og/join.png` }],
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

    {/* About the L2R course */}
    <div className="my-24" id="l2r">
      <Container>
        <SectionHeading
          label="Our Learn to Row course"
          title="Getting started in rowing couldn’t be easier"
        />

        <div className="mb-20 grid gap-12 md:grid-cols-2">
          <div>
            <div className="prose">
              <p className="lead">
                Our Learn to Row programme starts with a ‘taster session’ and
                teaches you the basics of sculling (an oar in each hand) and
                sweep oar rowing (one oar for both hands) over a period of 6-8
                weeks.
              </p>
              <p>
                We plan to run the Learn to Row programme on a group basis for
                adults over the next year and after your taster session you will
                be allocated a start date along with a number of other
                participants at a similar level. Juniors (under 18) will be
                separately invited to programmed courses.
              </p>
              <p>
                The programme costs £130 and for its duration, you’ll be a club
                member. The programme fee includes your first month’s adult
                membership to the club after which you will be given the option
                continue your membership at the adult rate of £32 per month
                thereafter.
              </p>
            </div>
          </div>
          <div className="prose relative -mx-2 -mb-1 rounded border-2 border-green-200 px-2 pb-1">
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
