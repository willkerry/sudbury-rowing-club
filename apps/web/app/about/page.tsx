import { fetchOfficerNames, fetchRegattaSettings } from "@sudburyrc/api";
import { IconArrowRight } from "@tabler/icons-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import NextLink from "next/link";
import CoxingImage from "@/assets/join/coxing.jpg";
import JuniorsImage from "@/assets/join/juniors.jpg";
import RacingImage from "@/assets/join/racing.jpg";
import RecreationalImage from "@/assets/join/recreational.jpg";
import VolunteerImage from "@/assets/join/volunteer.jpg";
import DroneImage from "@/assets/landing/drone.jpg";
import { Container } from "@/components/layouts/container";
import { about } from "@/components/nav/nav-data";
import { ImageComposite } from "@/components/regatta/landing-page/image-composite";
import { Hero } from "@/components/stour/hero";
import { Label } from "@/components/stour/label";
import { Link } from "@/components/stour/link";
import { Button } from "@/components/ui/button";
import { REGATTA } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { cn } from "@/lib/utils";
import { ClubBlade } from "./club-blade";
import { LazyClubPlan, LazyRiverPlan } from "./lazy-plans";
import { type Face, OfficerFaces } from "./officer-faces";
import { Officers } from "./officers";
import { Timeline } from "./timeline";

export const metadata = createMetadata({
  description:
    "Rowing on the River Stour in Sudbury, Suffolk, since 1874. Learn to row, or join our junior, racing and recreational squads. Home of Sudbury Regatta.",
  image: { title: "About Sudbury Rowing Club 🚣" },
  title: "About Sudbury Rowing Club",
});

const formatRegattaDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
    year: "numeric",
  }).format(new Date(date));

const ENTER =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out-strong";

type Squad = {
  title: string;
  description: string;
  anchor: string;
  image: StaticImageData;
  alt: string;
};

const SQUADS: Squad[] = [
  {
    alt: "A Sudbury double sculling in a race.",
    anchor: "Racing",
    description:
      "Regattas in summer and head races in winter, from local events to national championships.",
    image: RacingImage,
    title: "Racing",
  },
  {
    alt: "Sudbury rowers on a recreational tour.",
    anchor: "Recreational rowing",
    description:
      "All the rowing, none of the racing, at home and on tours abroad.",
    image: RecreationalImage,
    title: "Recreational",
  },
  {
    alt: "A Sudbury junior crew racing at Dorney Lake.",
    anchor: "Juniors",
    description:
      "Three groups for under-18s, from recreational rowing to racing at national level.",
    image: JuniorsImage,
    title: "Juniors",
  },
  {
    alt: "A Sudbury eight and its cox celebrating a win.",
    anchor: "Coxing",
    description: "Steer the boat and lead the crew.",
    image: CoxingImage,
    title: "Coxing",
  },
  {
    alt: "Members at the club’s Good Friday opening.",
    anchor: "Social Membership and Volunteers",
    description: "Mend boats, help crews on to the water, run the regatta.",
    image: VolunteerImage,
    title: "Social members and volunteers",
  },
];

const IMAGE_OUTLINE = "outline -outline-offset-1 outline-black/10";

const SquadCard = ({ title, description, anchor, image, alt }: Squad) => (
  <NextLink
    className="group flex flex-col overflow-hidden rounded-sm border bg-white transition-colors duration-150 hover:border-blue-500"
    href={`/join#${encodeURIComponent(anchor)}`}
  >
    <div className="relative aspect-3/2 overflow-hidden">
      <Image
        alt={alt}
        className="size-full object-cover transition-transform duration-500 ease-out-strong motion-safe:group-hover:scale-[1.03]"
        placeholder="blur"
        sizes="(min-width: 640px) 280px, 100vw"
        src={image}
      />
    </div>
    <div className="grid gap-0.5 p-3">
      <h3 className="flex items-center gap-1 font-semibold transition-colors duration-150 group-hover:text-blue-500">
        {title}
        <IconArrowRight
          aria-hidden
          className="size-4 -translate-x-1 opacity-0 transition-[translate,opacity] duration-150 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </h3>
      <p className="text-pretty text-gray-600 text-sm">{description}</p>
    </div>
  </NextLink>
);

const explore = about.filter(({ cta, href }) => !cta && href !== "/about");

const SANITY_IMAGES = "https://cdn.sanity.io/images/gvxge7ps/production";

type PhotoProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sizes: string;
  imageClassName?: string;
  className?: string;
};

const Photo = ({
  src,
  width,
  height,
  alt,
  caption,
  sizes,
  imageClassName,
  className,
}: PhotoProps) => (
  <figure className={className}>
    <Image
      alt={alt}
      className={cn(
        "w-full rounded-sm bg-gray-100 object-cover",
        IMAGE_OUTLINE,
        imageClassName,
      )}
      height={height}
      sizes={sizes}
      src={`${SANITY_IMAGES}/${src}`}
      width={width}
    />
    <figcaption className="mt-2 text-pretty text-gray-500 text-sm">
      {caption}
    </figcaption>
  </figure>
);

const About = async () => {
  const [{ date, title }, officers] = await Promise.all([
    fetchRegattaSettings(),
    fetchOfficerNames(),
  ]);

  const featured = officers.slice(0, 4);
  const featuredPeople = new Set(featured.map(({ occupantId }) => occupantId));
  const faces = officers
    .filter((officer): officer is Face => officer.avatar !== null)
    .filter(
      ({ occupantId }, i, all) =>
        !featuredPeople.has(occupantId) &&
        all.findIndex((other) => other.occupantId === occupantId) === i,
    );

  const ticketItems: [string, string][] = [
    ["Event", title],
    ["Date", formatRegattaDate(date)],
    ["Location", `${REGATTA.VENUE},\n${REGATTA.TOWN} ${REGATTA.POSTCODE}`],
  ];

  return (
    <>
      <Container className="mt-12 mb-16 sm:mt-20">
        <div className={cn("flex items-center gap-3", ENTER)}>
          <ClubBlade
            aria-label="The club blade, in Oxford blue and white"
            className="h-6 w-auto"
            role="img"
          />
          <Label as="p">About the club</Label>
        </div>
        <h1
          className={cn(
            "mt-4 max-w-2xl text-balance font-semibold text-4xl sm:text-6xl",
            ENTER,
            "motion-safe:delay-100",
          )}
        >
          Rowing on the Stour since 1874
        </h1>
        <p
          className={cn(
            "mt-6 max-w-2xl text-pretty text-gray-600 text-lg sm:text-xl",
            ENTER,
            "motion-safe:delay-200",
          )}
        >
          We’re a members’ club on Quay Lane, a five-minute walk from the centre
          of Sudbury, in the Stour Valley on the Suffolk–Essex border.
        </p>
        <p
          className={cn(
            "mt-4 text-gray-500 text-sm",
            ENTER,
            "motion-safe:delay-200",
          )}
        >
          The club’s colours are Oxford blue and white.
        </p>
      </Container>

      <Container className={cn(ENTER, "motion-safe:delay-300")}>
        <Image
          alt="An eight rowing along the River Stour on a summer evening."
          className={cn("w-full rounded-sm", IMAGE_OUTLINE)}
          placeholder="blur"
          priority
          sizes="(min-width: 896px) 864px, 100vw"
          src={DroneImage}
        />
      </Container>

      <Container className="my-24">
        <Hero label="What we do" title="Rowers from 12 to 80" />
        <div className="mb-10 grid max-w-prose gap-4 text-pretty text-gray-600">
          <p>
            We row all year round, in boats of every size: single sculls,
            doubles, pairs, quads, fours and eights. Racing crews compete in
            head races through the winter and regattas in the summer.
          </p>
          <p>
            Some members race at regional and national events; others row for
            the pleasure of it. We’re a family club.
          </p>
          <p>
            Our adaptive rowers race at national level. Luke Payne has
            represented England in the PR1 single at the Home International
            Regatta, and won silver at the 2025 British Rowing Club
            Championships.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SQUADS.map((squad) => (
            <SquadCard key={squad.title} {...squad} />
          ))}
          <div className="flex flex-col justify-center gap-4 rounded-sm border border-dashed p-5">
            <p className="text-pretty font-medium">
              Never rowed before? Start with our Learn to Row course.
            </p>
            <div>
              <Button asChild>
                <NextLink href="/join">Learn to row</NextLink>
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-8 max-w-prose text-pretty text-gray-600">
          Rowed here before? Former members can stay in touch with the club
          through{" "}
          <Link href="/members/membership-rates#associate">
            associate membership
          </Link>
          . It doesn’t include rowing or a vote at general meetings, but it
          gives you use of the club’s other facilities.
        </p>
      </Container>

      <div className="overflow-hidden bg-blue-950 py-16 text-white sm:py-20">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Label className="text-blue-200">The regatta</Label>
            <h2 className="text-balance pt-3 pb-6 font-semibold text-4xl">
              Sudbury Regatta
            </h2>
            <p className="text-pretty text-blue-100">
              Sudbury Regatta takes place on the first Saturday of August at
              Friars Meadow. It’s a traditional regatta, known locally as
              Sudbury’s ‘Little Henley’, and crews who have raced here call it
              the best little regatta in the world. One or two crews from abroad
              enter most years, which is why some still call it the
              ‘International’.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <NextLink href="/regatta">About the regatta</NextLink>
              </Button>
              <Button
                asChild
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
                variant="secondary"
              >
                <NextLink href="/regatta/results">Results</NextLink>
              </Button>
            </div>
          </div>
          <div className="text-gray-900">
            <ImageComposite
              cancelled={REGATTA.CANCELLED}
              interactive
              ticketItems={ticketItems}
            />
          </div>
        </Container>
      </div>

      <div className="bg-blue-50 py-16 sm:py-20">
        <Container>
          <Hero label="Our facilities" title="On the Cut, off Quay Lane" />
          <p className="mb-10 max-w-prose text-pretty text-gray-600">
            The club sits on a triangle of land at the end of Quay Lane, fenced
            on one side and bounded by water on the other two. That water is the
            Cut, a man-made channel off the River Stour, and it’s where every
            outing starts.
          </p>
          <LazyClubPlan className="mb-12 text-blue-950" />
          <div className="mb-16 grid gap-x-10 gap-y-8 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-lg">Getting here</h3>
              <p className="text-pretty text-gray-600">
                Babergh District Council’s free Quay Lane Car Park is right
                outside the club gates.
              </p>
              <Link
                arrow
                className="mt-3 inline-block"
                href="/contact/how-to-find-us"
              >
                How to find us
              </Link>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">The buildings</h3>
              <p className="text-pretty text-gray-600">
                The boathouse holds most of the fleet, with more boats on racks
                outside. The clubhouse has men’s and women’s changing rooms, a
                kitchen, and a room used for committee meetings and refreshments
                between sessions. Crews boat from the landing stage, which wraps
                round the corner of the bank.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Photo
              alt="Seen from the far bank: members help an adaptive sculler into a boat at the landing stage while a single sculler pushes off. The boathouse and clubhouse stand behind, with the club’s two launches moored to one side."
              caption="Members help an adaptive sculler into their boat as another sculler pushes off."
              height={1920}
              imageClassName="aspect-4/3"
              sizes="(min-width: 640px) 420px, 100vw"
              src="a2661bacfdf0c0694284b64abe3c93b2d49a79b6-2560x1920.jpg"
              width={2560}
            />
            <Photo
              alt="A smiling masters crew, hands on the gunwales, about to lift an eight off the trestles beside the boathouse."
              caption="A masters crew lifts the club’s Stämpfli eight off the trestles."
              height={950}
              imageClassName="aspect-4/3"
              sizes="(min-width: 640px) 420px, 100vw"
              src="4449281d763c4cb09a52f7e8b2d9df631317f2cd-1920x1080.jpg?rect=150,40,1620,950"
              width={1620}
            />
          </div>
        </Container>
      </div>

      <div className="bg-meadow py-16 sm:py-20">
        <Container>
          <Hero label="Our bit of river" title="1,500 metres of the Stour" />
          <p className="mb-10 max-w-prose text-pretty text-gray-600">
            From the landing stage, crews head down the Cut to the Stour. Since
            the river was straightened in 1955, we’ve had 1,500 metres of water,
            from a weir to a low bridge, wide enough to row in both directions.
            The straightest stretch is at the wooded weir end. Sudbury Regatta
            uses the middle of the river, so that as much of the racing as
            possible passes Friars Meadow, where competitors and spectators
            gather.
          </p>
          <LazyRiverPlan className="mb-12 text-blue-950" />
          <Photo
            alt="An aerial view of regatta day: two single scullers race down the Stour past Friars Meadow, which is lined with marquees, trailers and parked cars."
            caption="Regatta day on Friars Meadow, from the air."
            height={1224}
            sizes="(min-width: 896px) 864px, 100vw"
            src="61c84c1626c050e865227240c84aa393c61922f7-2448x1224.jpg"
            width={2448}
          />
        </Container>
      </div>

      <div className="bg-gray-950 py-16 text-white sm:py-20">
        <Container>
          <Hero dark label="Our people" title="Run by its members" />
          <div className="mb-10 grid max-w-prose gap-4 text-pretty text-gray-300">
            <p>
              Sudbury Rowing Club is run by its members and volunteers. Most
              members row, and most also give something back: they serve on the
              committee, coach, mend boats, help crews on and off the water,
              provide refreshments and put on Sudbury Regatta.
            </p>
            <p>
              There’s always something to do, and every pair of hands helps.{" "}
              <Link
                dark
                href={`/join#${encodeURIComponent("Social Membership and Volunteers")}`}
              >
                Find out about volunteering
              </Link>
              .
            </p>
          </div>
          <Officers dark officers={featured} />
          {faces.length > 0 && (
            <div className="mt-6">
              <OfficerFaces officers={faces} />
            </div>
          )}
          <Link arrow className="mt-6 inline-block" dark href="/governance">
            Meet the rest of the committee
          </Link>
          <p className="mt-10 text-gray-400 text-sm">
            Sudbury Rowing Club is affiliated to British Rowing and registered
            with HMRC as a Community Amateur Sports Club.
          </p>
        </Container>
      </div>

      <Container className="my-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="self-start md:sticky md:top-24 md:col-span-5">
            <Hero label="Our story" title="A short history" />
            <p className="text-pretty text-gray-600">
              For the full story, with photographs, see our history page.
            </p>
            <div className="mt-6 grid gap-2">
              <Link arrow href="/about/history">
                Club history
              </Link>
              <Link arrow href="/150">
                150th anniversary archive
              </Link>
            </div>
          </div>
          <div className="md:col-span-7">
            <Timeline />
          </div>
        </div>
      </Container>

      <Container className="my-24">
        <Photo
          alt="From the cox’s seat of a quad at sunset: the crew have stopped sculling, blades flat on the water, and turned to look at the sky."
          caption="A quad stops to watch the sun go down."
          height={1920}
          imageClassName="aspect-3/2 sm:aspect-2/1"
          sizes="(min-width: 896px) 864px, 100vw"
          src="5c71b93d594e20433e5ffc2baf05e7c6ffd03734-2560x1920.jpg"
          width={2560}
        />
      </Container>

      <Container className="my-24">
        <Hero label="More" title="Everything else" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {explore.map(({ href, name, description, icon: Icon }) => (
            <li key={href}>
              <NextLink
                className="group flex h-full gap-3 rounded-sm border p-4 transition-colors duration-150 hover:border-blue-500"
                href={href}
              >
                {Icon && (
                  <Icon
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-gray-400 transition-colors duration-150 group-hover:text-blue-500"
                  />
                )}
                <div>
                  <div className="font-semibold transition-colors duration-150 group-hover:text-blue-500">
                    {name}
                  </div>
                  {description && (
                    <p className="text-pretty text-gray-600 text-sm">
                      {description}
                    </p>
                  )}
                </div>
              </NextLink>
            </li>
          ))}
        </ul>
      </Container>

      <div className="bg-blue-950 py-20 text-center text-white">
        <Container>
          <h2 className="text-balance font-semibold text-3xl">
            Come and row with us
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-blue-100">
            Whether you’re new to rowing or coming back to it, send us a message
            and the right person will reply.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <NextLink href="/contact">Contact us</NextLink>
            </Button>
            <Button
              asChild
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              size="lg"
              variant="secondary"
            >
              <NextLink href="/join">Learn to row</NextLink>
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default About;
