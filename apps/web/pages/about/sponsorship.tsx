import { Link as ScrollLink } from "react-scroll";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Check, HeartHandshake } from "lucide-react";
import { fetchOfficerNames } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import { Sponsors } from "@/components/landing";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Hero from "@/components/stour/hero";
import Label from "@/components/stour/label";
import { Button } from "@/components/ui/button";

const TITLE = "Sponsorship";
const DESCRIPTION = "Partner with us and discover the benefits of sponsorship.";

const LINK_ON_SRC_WEBSITE = "Link on our website";

const SPONSORSHIP_TIERS = {
  "Club sponsor": {
    description: "Be the club’s main sponsor",
    benefits: [
      "Only one club sponsor",
      "Logo on racing kit worn for racing",
      "Logo on other equipment, such as flags, trailers etc",
      "Social media promotion across all platforms",
      LINK_ON_SRC_WEBSITE,
      "Team building day",
      "A table in the sponsors’ marquee at the Sudbury Regatta",
    ],
  },
  "Regatta sponsor": {
    description: "Sponsor Sudbury’s famous regatta",
    benefits: [
      "Main sponsor for the Sudbury Regatta",
      "Name and logo on regatta material",
      "Social media promotion across all platforms for the regatta",
      LINK_ON_SRC_WEBSITE,
      "A table in the sponsors marquee",
    ],
  },
  "Boat sponsor": {
    description: "Sponsor a boat",
    benefits: [
      "One sponsor per boat",
      "Name and logo on the side of the boat",
      "Social media promotion across all platforms following events",
      LINK_ON_SRC_WEBSITE,
      "Team building day",
      "Announcement during the Sudbury International Regatta",
      "Four entries to the sponsors’ marquee at the Sudbury Regatta",
    ],
  },
  "Board sponsor": {
    description: "Advertise at the club year-round",
    benefits: [
      "Advertising board at the club with the company logo",
      "Social media promotion across all platforms",
      LINK_ON_SRC_WEBSITE,
      "Announcement during the Sudbury Regatta",
    ],
  },
} satisfies Record<
  string,
  {
    description: string;
    benefits: string[];
  }
>;

const EMPHASISED_INDEX = 2;

const SponsorshipTiers = ({
  tiers,
  emphasisedIndex,
}: {
  tiers: Record<
    string,
    {
      description: string;
      benefits: string[];
    }
  >;
  emphasisedIndex?: number;
}) => (
  <ul
    className="my-12 grid gap-8 rounded sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:border"
    id="sponsorship-tiers"
  >
    {Object.entries(tiers).map(([tier, { benefits, description }], i) => (
      <li
        className={cn(
          i === emphasisedIndex
            ? "-my-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-xl"
            : "border-b px-3 py-6 lg:border-b-0 lg:py-2",
          emphasisedIndex &&
            i !== emphasisedIndex - 1 &&
            i !== Object.keys(tiers).length - 1
            ? "lg:border-r"
            : "",
        )}
        key={tier}
      >
        <h3 className="mb-3 text-lg font-semibold">{tier}</h3>
        <p className="mb-3 min-h-16 text-gray-700">{description}</p>

        <Button
          asChild
          className="mb-4 w-full"
          variant={i === emphasisedIndex ? "brand" : "secondary"}
          shadow={i === emphasisedIndex ? true : false}
          size="xs"
        >
          <Link href="/contact?q=sponsorship">
            {i === emphasisedIndex ? "Sponsor a boat" : "Enquire"}
          </Link>
        </Button>

        <ul className="my-2 grid grid-cols-1 gap-2 text-sm font-medium">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-x-2">
              <Check className="mt-1.5 h-4 w-4 flex-none text-blue-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export const getStaticProps = async () => {
  const officers = await fetchOfficerNames();

  const sponsorshipOfficer = officers.find(({ role }) =>
    role.toLowerCase().includes("sponsor"),
  );

  return {
    props: {
      sponsorshipOfficer,
    },
  };
};

const SponsorshipPage = ({
  sponsorshipOfficer,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout>
    <NextSeo
      title={TITLE}
      description={DESCRIPTION}
      openGraph={{
        title: TITLE,
        description: DESCRIPTION,
        images: [{ url: makeShareImageURL(TITLE, true) }],
      }}
    />

    <Container className="py-16 text-center text-gray-900 sm:py-24" id="hero">
      <Label className="sm:mb-3">{TITLE}</Label>
      <h1 className="relative z-10 bg-gradient-to-br from-blue-400 to-blue-700 bg-clip-text text-6xl font-semibold text-transparent drop-shadow-xl sm:text-8xl">
        Sponsor us{" "}
        <HeartHandshake className="inline h-12 w-12 rotate-6 text-gray-400 drop-shadow-2xl sm:h-16 sm:w-16" />
      </h1>

      <div className="prose mx-auto mb-16 mt-12 max-w-xl text-left">
        <p className="lead">
          Sudbury Rowing Club is looking for sponsors to help support the club
          and its members. {DESCRIPTION}
        </p>
      </div>

      <div className="flex justify-center gap-2 pb-12">
        <ScrollLink
          to="sponsorship-tiers"
          offset={-175}
          smooth
          className="text-white"
        >
          <Button variant="secondary" size="lg">
            Learn more
          </Button>
        </ScrollLink>
        <Button asChild size="lg">
          <Link href="/contact?q=sponsorship">Enquire now</Link>
        </Button>
      </div>

      <Sponsors excludeAffiliates />
    </Container>

    <Container className="mb-24 mt-12">
      <Hero label="The club" title="Who are we?" />
      <div className="prose">
        <p className="lead">
          Sudbury Rowing Club was founded in 1874 and is a thriving sports club
          at the heart of the local community.
        </p>
        <p>
          We aim to provide a platform for people of all backgrounds, ages and
          abilities to achieve their ambitions, whether these at the highest
          level, or simply to enjoy rowing on our lovely river.
        </p>
        <p>
          We are proud to be a family club, invest in and support adaptive
          athletes and to have rowers aged from 12 to 80 competing at regional
          and national events.
        </p>
      </div>
    </Container>

    <Container className="mb-24 mt-12">
      <Hero label="The need" title="Why do we need sponsors?" />
      <div className="prose">
        <p className="lead">
          Your sponsorship directly contributes to the growth and success of our
          club.
        </p>
        <p>
          The club generates revenue through membership fees and its annual
          regatta. This provides funds for the running of the club and to
          undertake maintenance activities but falls short of the revenue needed
          to reinvest in racing shells and other equipment.
        </p>
        <p>
          Therefore, additional income is required to bring the current fleet up
          to standard and allow those members who race to remain competitive,
          whilst also providing suitable equipment for recreational rowers.
        </p>
      </div>
    </Container>

    <Container className="mb-24 mt-12">
      <Hero label="The benefits" title="How does sponsorship benefit you?" />
      <div className="prose">
        <p>
          The club attends a number of regional events as well as some national
          events, such as Henley Royal Regatta and the Head of the River Race.
          These events provide large audiences which have the potential to
          generate increased brand exposure for sponsors.
        </p>
        <p>
          Sudbury RC also has an active social media following across a number
          of platforms. This again brings the opportunity for increased brand
          exposure for sponsors, which the club can tailor to meet an
          organisation’s individual needs.
        </p>
      </div>
    </Container>

    <section className="mx-auto max-w-screen-lg p-4">
      <Hero label="Sponsorship tiers" title="What can you sponsor?" />
      <div className="prose">
        <p>
          A number of sponsorship opportunities are available at Sudbury Rowing
          Club. Each tier offers a range of benefits, from social media
          promotion to team building days.
        </p>
      </div>

      <SponsorshipTiers
        tiers={SPONSORSHIP_TIERS}
        emphasisedIndex={EMPHASISED_INDEX}
      />
    </section>

    {/* Wrap up */}
    <Container className="mb-24 mt-12">
      <Hero label="Speak to us" title="Want to find out more?" />
      <div className="prose mb-6">
        <p>
          Our sponsorship officer
          {sponsorshipOfficer?.name ? `, ${sponsorshipOfficer?.name}, ` : ""} is
          available to discuss the various sponsorship opportunities available
          at Sudbury Rowing Club.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/contact?q=sponsorship">Contact us</Link>
      </Button>
    </Container>
  </Layout>
);

export default SponsorshipPage;
