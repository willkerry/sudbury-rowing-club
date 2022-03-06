import { ThumbsUp } from "react-feather";
import PropTypes from "prop-types";
import Image from "next/image";
import cn from "classnames";
import { Link as ScrollLink } from "react-scroll";
import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
// eslint-disable-next-line import/no-named-as-default
import Note from "@/components/stour/note";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import Label from "@/components/stour/label";

const l2rStages = [
  {
    index: 0,
    name: "Apply",
    content:
      "Contact our Learn to Row coordinator to request an application form, or apply online.",
  },
  {
    index: 1,
    name: "Attend a 90 minute taster session",
    content:
      "We’ll explain the basics and show you our boats, boathouse and other facilities. You’ll be introduced to the rowing stroke on a rowing machine and try it out in either a bank-fixed boat or a stable training scull.",
  },
  {
    index: 2,
    name: "Complete the Learn to Row programme",
    content:
      "The programme’s a mix of theory and coached practical on the water. We aim to organise the programme so you start with others at your standard, so you can develop your skills together.",
  },
  {
    index: 3,
    name: "Attend a capsize drill",
    content:
      "Before you join the club as a regular member, you’ll need to attend a capsize drill (it takes place at a local pool and lasts a couple of hours).",
  },
  {
    index: 4,
    name: "Move into our Development Squad",
    content:
      "You’ll attend regular coached sessions and develop your skills with other new members.",
  },
  {
    index: 5,
    name: "Move into a rowing squad",
    content: "Move into one of our rowing squads and enjoy your new sport.",
  },
];

const overview = [
  {
    index: 0,
    title: "Juniors",
    subtitle: "There’s a different route for under-18s.",
    content: [
      "The main aim of the Junior Squad is to introduce young people to the sport of rowing with a view to future participation in top domestic events including: the main Head races; National Schools; Junior Inter regional; and National Championship regattas.",
      "The Junior Squad also acts as a feeder to the senior sections of the club. In this manner the more senior juniors gradually integrate with senior athletes and act as role models for the younger members.",
      "The competition junior squad trains three times a week (Wednesday, Saturday and Sunday) and the high performance juniors aim to train six days a week.",
      "The novice Junior squad trains on Sunday mornings.",
    ],
    image: {
      src: "/assets/join/juniors.jpg",
      alt: "A Sudbury junior crew racing at Dorney Lake, the 2012 Olympic rowing venue.",
      width: 1146,
      height: 640,
    },
  },
  {
    index: 1,
    title: "Racing",
    subtitle: "The thrill of rowing.",
    content: [
      "Competition in rowing falls into two seasons. The regatta season runs throughout the summer (generally from around May to August). Regattas are sprint races that allow for side by side racing, or at bigger events, multi-lane racing. Distances vary but cover anything from 500m to 2000m.",
      "The head season runs throughout the winter. Head races are generally over longer distances and are organised as time trials; boats start racing one after the other.",
      "In the last twelve months we’ve attended over 40 events, ranging from our locals at Norwich, Bedford, St Neots and Peterborough, to further afield events at Wallingford, Oxford and the Olympic venue at Eton Dorney.",
      "In recent years we entered nearly all of the National Events including the Head of the River races, National Championships, Ladies and Henley Royal Regatta and the World Championships. There’s something for everyone, from Novice to Elite.",
      "We aim to group people with similar rowing aspirations into crews. As a member of a crew you will train on the water and build your fitness on land. The level at which you can compete will depend on you and your fellow crew members but you will be able to take part in your first races within a few months of taking up the sport.",
      "Our own Regatta, always held on the first Saturday of August, is highly regarded as a gem of a traditional regatta and is always a highlight in our own rowing year.",
    ],

    image: {
      src: "/assets/join/racing.jpg",
      alt: "A Sudbury double races to victory.",
      width: 960,
      height: 640,
    },
  },
  {
    index: 2,
    title: "Recreational rowing",
    subtitle: "You don’t have to race to row.",
    content: [
      "Non competitive recreational rowing is a fun way of getting fit and enjoying the outdoors. Membership of the club and British Rowing gives you access to contact other clubs and arrange to row in different venues.",
      "We also have a group who travel to Portugal each summer for four days of varied rowing on an organised event. There are lots of opportunities to row at Sudbury outside of the normal club sessions during the week or evenings in the summer.",
    ],
    image: {
      src: "/assets/join/recreational.jpg",
      alt: "Sudbury rowers in Hungary.",
      width: 2560,
      height: 1920,
    },
  },
  {
    index: 3,
    title: "Coxing",
    subtitle: "",
    content: [
      "We warmly welcome anyone with an interest in coxing: whether new to boats or an old hand. Generally, coxes are put with crews that match their abilities and objectives, but we also operate a coxing rotation policy, so novice coxes can learn from experienced crews and vice versa.",
      "Similarly, coxes are welcome to take out men’s and women’s crews depending on their preference.",
    ],
    image: {
      src: "/assets/join/coxing.jpg",
      alt: "A Sudbury eight crew and cox pose for a post-win photo. ",
      width: 2048,
      height: 1536,
    },
  },
  {
    index: 4,
    title: "Social Membership and Volunteers",
    subtitle: "",
    content: [
      "SRC is very much an active sociable club. We provide opportunities to be with other people, perhaps to provide help and support and to work with others as part of a team.",
      "We are always in need of people to help mend boats, provide refreshments, keep the boathouse tidy and shipshape, help crews get on or off the water and even help with coaching.",
    ],

    image: {
      src: "/assets/join/volunteer.jpg",
      alt: "Members at our annual Good Friday opening. ",
      width: 1048,
      height: 649,
    },
  },
  {
    index: 5,
    title: "Commitment",
    subtitle: "",
    content: [
      "Like any sport, rowing takes time to master and you will gain reward proportional to the time and effort you are prepared to put in.</p><p>Welcome to Sudbury and good luck!",
    ],
  },
];

export default function Index() {
  return (
    <Layout>
      <NextSeo
        description="Everything you need to know about getting rowing."
        openGraph={{
          title: "Start rowing at Sudbury Rowing Club",
          description: "Everything you need to know about getting rowing.",
          images: [{ url: `${BASE_URL}/assets/og/join.png` }],
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
          style={{ maxWidth: 240, maxHeight: 160 }}
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
            rowed before and are seeking a new activity, or have rowed in the
            past and would like to return to the sport.
          </p>
          <p>
            We have two routes to club membership and only one essential
            criterion – that you can swim 50m.
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
                  Our next two Learn to Row courses will run 13:00 to 16:00 on
                  Saturday afternoons from, Course 1: 12 Mar to 2 Apr 2022, and
                  course 2: 23 April to 14 May 2022. Please{" "}
                  <Link href="join/apply">apply now.</Link>
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
                member, and at the end you’ll be given the option to continue
                your membership at the current adult rate of £32 per month.
              </p>
            </div>
          </div>
          {/* Grid <ol> component for L2R stages */}
          <L2RStages />
          <L2RCallToAction />
        </Container>
      </div>
      <Container className="text-gray-800" id="overview">
        <SectionHeading
          label="What to expect"
          title="What can you do at Sudbury Rowing Club?"
        />
        <div className="gap-16 my-24 sm:grid sm:grid-cols-12">
          <div className="hidden sm:col-span-4 sm:block">
            <OverviewSidebar />
          </div>
          <OverviewContent />
        </div>
        <L2RCallToAction />
      </Container>
    </Layout>
  );
}

function JoinCTA() {
  return (
    <div className="grid gap-12 p-12 bg-gray-100 border rounded shadow-lg md:grid-cols-2">
      <div>
        <p className="text-center">
          <span className="text-xl font-medium text-gray-800">
            New to the sport?
          </span>
          <br />
          <span className="text-gray-500">
            Our Learn to Row programme is for you.
          </span>
        </p>
        <span className="block h-6" />
        <div className="flex justify-center">
          <Button
            as={ScrollLink}
            duration={300}
            offset={-30}
            size="large"
            smooth
            spy
            to="l2r"
            variant="secondary"
          >
            Learn to Row
          </Button>
        </div>
      </div>
      <div>
        <p className="text-center">
          <span className="text-xl font-medium text-gray-800">
            Already an active rower?
          </span>
          <br />
          <span className="text-gray-500">
            Contact the a vice-captain for more information.
          </span>
        </p>

        <span className="block h-6" />
        <div className="flex justify-center">
          <Button as={Link} href="/contact" size="large">
            Contact the Captain
          </Button>
        </div>
      </div>
    </div>
  );
}

function L2RStages() {
  return (
    <div className="mt-24">
      <Label as="h3" className="mb-6 ml-8 text-green-600 md:ml-0">
        How it works
      </Label>
      <ol className="grid gap-16 text-green-500 sm:grid-cols-2 md:grid-cols-3">
        <style jsx>{`
          ol {
            list-style: none;
            counter-reset: a;
          }
          ol li {
            counter-increment: a;
            position: relative;
          }
          ol li::before {
            content: counter(a);
            font-weight: 500;
            font-size: 0.875rem;
            text-align: center;
            position: absolute;
            border-radius: 100%;
            border-width: 1px;
            border-color: currentColor;
            width: 1.25rem;
            height: 1.25rem;
            top: 1px;
            left: -2rem;
            line-height: 1.3;
          }
          ol li p {
            color: inherit;
          }
        `}</style>
        {l2rStages.map((stage) => (
          <li key={stage.index} className="ml-8 md:ml-0">
            <div className="text-lg font-semibold leading-tight tracking-tight text-gray-700">
              {stage.name}
            </div>
            <p className="!text-gray-500">{stage.content}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="col-span-8 prose">
      {overview.map(({ title, content, index, image }) => (
        <div key={index} id={title}>
          {image && (
            <div className="flex overflow-hidden rounded shadow">
              <Image
                alt={image.alt}
                height={(635 / image.width) * image.height}
                src={image.src}
                width={635}
              />
            </div>
          )}
          <h3>{title}</h3>
          <div className="pb-10">
            {content.map((paragraph) => (
              <p key={paragraph.substring(4, 9)}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewSidebar() {
  return (
    <ul className="sticky space-y-4 md:space-y-6 top-10">
      {overview.map(({ title, subtitle, index }) => (
        <li key={index}>
          <ScrollLink
            activeClass="!text-blue-500 font-semibold"
            className="font-medium text-gray-700 transition hover:text-gray-900 hover:cursor-pointer"
            duration={200}
            offset={-30}
            smooth
            spy
            to={title}
          >
            {title}
          </ScrollLink>
          <div className="hidden text-sm text-gray-500 md:block">
            {subtitle}
          </div>
        </li>
      ))}
    </ul>
  );
}

function L2RCallToAction() {
  const classes =
    "flex items-center justify-between gap-4 p-6 border shadow rounded";
  return (
    <div className="grid gap-6 my-20 text-gray-700 sm:gap-12 md:grid-cols-2 sm:my-36">
      <div className={cn("border-green-300 bg-green-50", classes)}>
        Send your application form now
        <Button as={Link} href="/join/apply" variant="success">
          Apply
        </Button>
      </div>
      <div className={cn("border-gray-300 bg-gray-50", classes)}>
        <span className="tracking-snug">
          Contact the Learn to Row coordinator
        </span>
        <Button as={Link} href="/contact">
          Contact
        </Button>
      </div>
    </div>
  );
}

function SectionHeading({ title, label }) {
  return (
    <div className="my-16 text-center">
      <Label as="div" className="my-4">
        {label}
      </Label>
      <h2 className="text-5xl font-bold tracking-tighter">{title}</h2>
    </div>
  );
}

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
