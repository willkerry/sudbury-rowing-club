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
      <h1 className="relative z-10 text-6xl font-semibold tracking-tighter text-green-500 sm:text-8xl drop-shadow-xl">
        Start rowing with us{" "}
        <ThumbsUp className="inline w-12 h-12 text-blue-400 sm:w-16 sm:h-16 rotate-3" />
      </h1>
      <div
        className="z-0 flex mx-auto overflow-hidden rounded shadow-xl -rotate-2"
        style={{ maxHeight: 160, maxWidth: 240 }}
      >
        <Image
          alt="Trainee rowers on the water during on learn to row course."
          height={160}
          src="/assets/join/l2r.jpg"
          width={240}
        />
      </div>
      <div className="max-w-xl mx-auto mt-12 mb-16 prose text-left">
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
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="prose">
              <p className="lead">
                Our Learn to Row programme starts with a ‘taster session’ and
                teaches you the basics of sculling (an oar in each hand) and
                sweep oar rowing (one oar for both hands) over a period of 6-8
                weeks.
              </p>
            </div>
            <div className="max-w-md">
              <Note label="Course Dates" type="success">
                We’re running two Learn to Row courses this Spring. Both run
                13:00 to 16:00 on Saturday afternoons.
                <ul>
                  <li>Course 1: 12 Mar to 2 Apr 2022</li>
                  <li>Course 2: 23 Apr to 14 May 2022</li>
                </ul>
                Please <Link href="join/apply">apply now.</Link>
              </Note>
            </div>
          </div>
          <div className="prose">
            <p>
              We plan to run the Learn to Row programme on a group basis for
              adults over the next year and after your taster session you will
              be allocated a start date along with a number of other
              participants at a similar level. Juniors (under 18) will be
              separately invited to programmed courses.
            </p>
            <p>
              The programme costs £100. For its duration, you’ll be a club
              member, and at the end you’ll be given the option to continue your
              membership at the current adult rate of £32 per month.
            </p>
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
