import Image, { type StaticImageData } from "next/image";
import aerial1936Image from "public/assets/history/1936-aerial-boathouse.jpg";
import henley2002Image from "public/assets/history/2002-henley.jpg";

const SANITY_IMAGES = "https://cdn.sanity.io/images/gvxge7ps/production";

type Milestone = {
  year: number | string;
  title: string;
  description?: string;
  image?: {
    src: StaticImageData | string;
    width?: number;
    height?: number;
    alt: string;
    caption: string;
  };
};

const MILESTONES: Milestone[] = [
  {
    description:
      "The club is founded as the Stour Boat Club. In the early years, the river is too narrow for crews to race side by side, so at regattas they start 50 yards apart and chase each other.",
    title: "The Stour Boat Club",
    year: 1874,
    image: {
      alt: "An early Sudbury regatta: a crew rows past a crowded bank, with women in Victorian dress watching from a boat in the foreground.",
      caption: "An early regatta on the Stour.",
      height: 964,
      src: `${SANITY_IMAGES}/edb43fed951f00f4ba1790a9dc60182802925f3f-1559x964.jpg`,
      width: 1559,
    },
  },
  {
    description:
      "After several years without a club, members bring it back to life.",
    title: "The club is re-formed",
    year: 1883,
  },
  {
    description:
      "Women join the club for the first time and row for about four years. They return in the early 1950s, and soon have two strong crews.",
    title: "The first women members",
    year: 1926,
  },
  {
    description:
      "On 26 July, a week before the regatta, fire destroys the boathouse and all its equipment. With borrowed boats and oars, the regatta goes ahead. The new boathouse opens on 16 March 1932.",
    title: "The boathouse burns down",
    year: 1931,
    image: {
      alt: "A 1936 aerial view of the new boathouse at the water’s edge, beside the Quay Lane gasworks.",
      caption: "The new boathouse at the water’s edge, from the air in 1936.",
      src: aerial1936Image,
    },
  },
  {
    description:
      "Flood prevention work straightens and widens the river, giving the club 1,500 metres of water wide enough for rowing in both directions. At last, crews can race side by side.",
    title: "The Stour is straightened",
    year: 1955,
    image: {
      alt: "A newspaper photograph of the newly widened Stour, where the club’s cut joins the main river.",
      caption: "The newly widened river, as shown in a 1955 newspaper.",
      height: 2020,
      src: `${SANITY_IMAGES}/ea05b60757d5a607876661b641629d70b9565c50-8811x5217.jpg?rect=2720,720,5980,2020`,
      width: 5980,
    },
  },
  {
    description:
      "Sudbury Town Football Club buys the neighbouring meadow and gives the club the land it uses.",
    title: "A permanent home",
    year: 1956,
    image: {
      alt: "Women members in club blazers stand in front of the men at the boathouse doors for a Good Friday opening in the 1950s, drinks in hand.",
      caption: "A Good Friday opening in the 1950s.",
      height: 1892,
      src: `${SANITY_IMAGES}/f96ecebde532d4fd2207f4f91165d49eb1dc8f15-3138x1892.jpg`,
      width: 3138,
    },
  },
  {
    description:
      "The Stour Boat Club becomes Sudbury Rowing Club, naming itself after the town rather than the river.",
    title: "A new name",
    year: 1975,
    image: {
      alt: "Members gather outside the boathouse for the Good Friday opening as a junior crew sits in a boat at the landing stage, watched by a guest wearing a chain of office.",
      caption: "A Good Friday opening, some years after the change of name.",
      height: 3588,
      src: `${SANITY_IMAGES}/989097edb2385a01bd00d222b06aae92ac8d58e3-4926x3588.jpg`,
      width: 4926,
    },
  },
  {
    description:
      "A new generation of members buys new equipment and refits the boathouse. Alton Blades Rowing Club merges into the club, bringing more boats and more members.",
    title: "A fresh start",
    year: "1980s",
    image: {
      alt: "A large group of members on Friars Meadow around 1990, many holding tankards, beside a flagpole with a marquee at the edge of the frame.",
      caption: "Members with their tankards on Friars Meadow, around 1990.",
      height: 2069,
      src: `${SANITY_IMAGES}/33625b01169d6ecd112208e6459ab6fd95ab4266-2833x2069.jpg`,
      width: 2833,
    },
  },
  {
    description:
      "The clubhouse opens for the club’s 125th anniversary, with funding from the National Lottery, the Sports Aid Foundation, Sudbury Common Lands Trust, Sudbury Freemen’s Trust and Babergh District Council.",
    title: "A new clubhouse",
    year: 1999,
    image: {
      alt: "Members in blazers gather with a cake outside the new clubhouse, decorated with bunting, on its opening day.",
      caption: "Cake and bunting for the clubhouse opening.",
      height: 687,
      src: `${SANITY_IMAGES}/7319c5d3d370b2b618a1f0444a79842ee0aa621b-1024x687.jpg`,
      width: 1024,
    },
  },
  {
    description:
      "Peter Gostling becomes the first member to race at Henley Royal Regatta in Sudbury colours, sculling in a composite quad in the Fawley Challenge Cup.",
    title: "First time at Henley",
    year: 2001,
    image: {
      alt: "A quad sits on the water in front of a crowded enclosure at Henley Royal Regatta.",
      caption: "The quad at Henley, 2001.",
      height: 4114,
      src: `${SANITY_IMAGES}/d599a09de088b2c6e5ea0c79fbd29405813e5c1f-6208x4114.jpg`,
      width: 6208,
    },
  },
  {
    description:
      "Aidan Dunn and Sam Hogsbjerg become the first Sudbury crew to race at Henley Royal Regatta. Racing in the Silver Goblets & Nickalls’ Challenge Cup, the pair beat Yale University in their opening race.",
    title: "The first Sudbury crew at Henley",
    year: 2002,
    image: {
      alt: "Sam Hogsbjerg and Aidan Dunn carry their pair at Henley Royal Regatta.",
      caption: "Sam Hogsbjerg and Aidan Dunn at Henley, 2002.",
      src: henley2002Image,
    },
  },
  {
    description:
      "Jenny Spencer, coached by Tony Moule, becomes national champion in the women’s J15 single sculls, coming from behind in the final to win by five seconds.",
    title: "A national champion",
    year: 2006,
  },
  {
    description:
      "Luke Payne qualifies at the trials and represents England in the PR1 single at the Home International Regatta, racing over 2,000 metres at London Docklands.",
    title: "Racing for England",
    year: 2022,
  },
  {
    description:
      "Martha Bullen and Amelia Moule become the club’s first women’s crew to qualify for Henley Royal Regatta, in the Stonor Challenge Trophy for women’s double sculls.",
    title: "A women’s crew at Henley",
    year: 2023,
  },
  {
    description:
      "The club celebrates its 150th anniversary, including a row-past at Henley Royal Regatta. At the British Rowing Club Championships, a Sudbury mixed crew wins a national title.",
    title: "150 years",
    year: 2024,
    image: {
      alt: "Club members of all ages in anniversary kit, standing beneath a pair of crossed blades at Henley Royal Regatta.",
      caption: "At Henley Royal Regatta, after the anniversary row-past.",
      height: 882,
      src: `${SANITY_IMAGES}/2529f5ff6bd8be4ee849c0a4f7237a4fee8a450a-1298x882.jpg`,
      width: 1298,
    },
  },
  {
    description:
      "At the British Rowing Club Championships, Luke Payne wins adaptive silver, the women’s eight takes silver in its first race together, and Harry Moule wins gold in a composite quad with Hereford.",
    title: "National medals",
    year: 2025,
  },
];

export const Timeline = () => (
  <ol className="relative grid gap-8 border-gray-200 border-l pl-6 sm:pl-8">
    {MILESTONES.map(({ year, title, description, image }) => (
      <li className="group relative" key={year}>
        <span
          aria-hidden
          className="absolute top-1.5 -left-[calc(1.5rem+4.5px)] size-2 rounded-full bg-gray-300 ring-4 ring-white transition-colors duration-200 group-hover:bg-blue-500 sm:-left-[calc(2rem+4.5px)]"
        />
        <div className="font-medium text-gray-500 text-sm tabular-nums transition-colors duration-200 group-hover:text-blue-500">
          {year}
        </div>
        <h3 className="mt-0.5 text-balance font-semibold text-lg">{title}</h3>
        {description && (
          <p className="mt-1 max-w-prose text-pretty text-gray-600">
            {description}
          </p>
        )}
        {image && (
          <figure className="mt-3 max-w-sm">
            <Image
              alt={image.alt}
              className="w-full rounded-sm bg-gray-100 outline outline-black/10 -outline-offset-1"
              height={image.height}
              placeholder={typeof image.src === "string" ? "empty" : "blur"}
              sizes="(min-width: 640px) 384px, 100vw"
              src={image.src}
              width={image.width}
            />
            <figcaption className="mt-1.5 text-gray-500 text-xs">
              {image.caption}
            </figcaption>
          </figure>
        )}
      </li>
    ))}
  </ol>
);
