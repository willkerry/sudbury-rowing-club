import { fetchOfficerNames } from "@sudburyrc/api";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { ScrollReveal } from "@/components/sponsorship/scroll-reveal";
import { SponsorshipHero } from "@/components/sponsorship/sponsorship-hero";
import { SponsorshipTiers } from "@/components/sponsorship/sponsorship-tiers";
import { Hero } from "@/components/stour/hero";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/create-metadata";

const TITLE = "Sponsorship";
const DESCRIPTION =
  "Sponsor Sudbury Rowing Club – put your brand on racing boats and in front of thousands of spectators, from local regattas to Henley.";

const LINK_ON_SRC_WEBSITE = "Link on our website";

const SPONSORSHIP_TIERS = {
  "Board sponsor": {
    description: "Year-round visibility at the boathouse",
    benefits: [
      "Advertising board at the club with your company logo",
      "Social media promotion across all platforms",
      LINK_ON_SRC_WEBSITE,
      "Announcement during the Sudbury Regatta",
    ],
  },
  "Boat sponsor": {
    description: "Your name on the water at every race",
    benefits: [
      "Exclusive – one partner per boat",
      "Name and logo on the side of the boat",
      "Social media shoutouts after every event",
      LINK_ON_SRC_WEBSITE,
      "A team building day on the river for your staff",
      "Announcement during the Sudbury International Regatta",
      "Four entries to the sponsors’ marquee at the Sudbury Regatta",
    ],
  },
  "Club sponsor": {
    description: "The club’s headline partner – on kit, equipment, and events",
    benefits: [
      "Exclusive – one club sponsor only",
      "Logo on racing kit worn at every event",
      "Logo on equipment, flags, and trailers",
      "Social media promotion across all platforms",
      LINK_ON_SRC_WEBSITE,
      "A team building day on the river for your staff",
      "A table in the sponsors’ marquee at the Sudbury Regatta",
    ],
  },
  "Regatta sponsor": {
    description: "Headline the region’s biggest rowing event",
    benefits: [
      "Main sponsor for the Sudbury Regatta",
      "Name and logo on all regatta material",
      "Dedicated social media promotion for the regatta",
      LINK_ON_SRC_WEBSITE,
      "A table in the sponsors’ marquee",
    ],
  },
} satisfies Record<
  string,
  {
    description: string;
    benefits: string[];
  }
>;

export const metadata = createMetadata({
  description: DESCRIPTION,
  title: TITLE,
});

const SponsorshipPage = async () => {
  const officers = await fetchOfficerNames();

  const findOfficer = (keyword: string) =>
    officers.find(({ role }) => role.toLowerCase().includes(keyword));

  const sponsorshipOfficer = findOfficer("sponsor");
  const contact =
    sponsorshipOfficer ?? findOfficer("secretary") ?? findOfficer("chair");

  return (
    <>
      <SponsorshipHero
        description="Put your brand in front of thousands of spectators – from local regattas to Henley."
        title={TITLE}
      />

      <ScrollReveal>
        <Container className="mt-12 mb-24">
          <Hero label="Your impact" title="Where your sponsorship goes" />
          <div className="prose">
            <p className="lead">
              Every sponsorship goes directly into boats, training equipment,
              and youth development.
            </p>
            <p>
              Membership fees and our annual regatta cover the day-to-day
              running of the club, but they don't stretch to replacing and
              upgrading the fleet. Your support keeps our crews competitive at
              events from local regattas to Henley – and puts your brand
              alongside them.
            </p>
          </div>
        </Container>
      </ScrollReveal>

      <ScrollReveal>
        <Container className="mt-12 mb-24">
          <Hero label="Your reach" title="Where your brand goes" />
          <div className="prose">
            <p>
              Our crews race at events across the region and nationally –
              including Henley Royal Regatta and the Head of the River Race –
              putting your brand in front of large, engaged audiences.
            </p>
            <p>
              The <Link href="/regatta">Sudbury Regatta</Link> draws crews and
              spectators from across East Anglia every August. Combined with our
              prominent riverside location near Friars Meadow and our social
              media following, we can tailor exposure to fit what your business
              needs.
            </p>
          </div>
        </Container>
      </ScrollReveal>

      <ScrollReveal>
        <Container className="mt-12 mb-24">
          <Hero label="Sponsorship tiers" title="What can you sponsor?" />
          <div className="prose">
            <p>
              Four ways to partner with us – from a board at the boathouse to
              your logo on racing kit.
            </p>
          </div>

          <SponsorshipTiers emphasisedIndex={1} tiers={SPONSORSHIP_TIERS} />
        </Container>
      </ScrollReveal>

      <ScrollReveal>
        <Container className="mt-12 mb-24">
          <Hero label="Speak to us" title="Interested?" />
          <div className="prose mb-6">
            <p>
              {contact
                ? `${contact.name}, our ${contact.role.toLowerCase()}, would`
                : "We'd"}{" "}
              love to talk through which tier is the right fit for your
              business.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact?q=sponsorship,secretary,chair">
              Enquire about sponsorship
            </Link>
          </Button>
        </Container>
      </ScrollReveal>
    </>
  );
};

export default SponsorshipPage;
