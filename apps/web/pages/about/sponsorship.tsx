import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import groq from "groq";
import { fetchOfficerNames, sanityClient } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Gallery from "@/components/regatta/landing-page/gallery";
import { SponsorshipHero } from "@/components/sponsorship/sponsorship-hero";
import { SponsorshipTiers } from "@/components/sponsorship/sponsorship-tiers";
import Hero from "@/components/stour/hero";
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

export const getStaticProps = async () => {
  const officers = await fetchOfficerNames();

  const sponsorshipOfficer = officers.find(({ role }) =>
    role.toLowerCase().includes("sponsor"),
  );

  const images: {
    _id: string;
    caption: string;
    lqip: string;
    aspectRatio: number;
  }[] = await sanityClient.fetch(groq`
  *[_id == "siteSettings" && !(_id in path("drafts.**"))][0].landingPage.images[] {
        caption,
        "_id": asset->_id,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      }
  `);

  return {
    props: {
      sponsorshipOfficer,
      images,
    },
  };
};

const SponsorshipPage = ({
  sponsorshipOfficer,
  images,
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

    <SponsorshipHero
      title={TITLE}
      description={`Sudbury Rowing Club is looking for sponsors to help support the club and
        its members. ${DESCRIPTION}`}
    />

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

    <div className="py-24">
      <Gallery images={images} />
    </div>

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

    <Container className="mb-24 mt-12">
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
    </Container>

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
