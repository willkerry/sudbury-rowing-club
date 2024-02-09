import { MapPinIcon } from "@heroicons/react/24/solid";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Map, Marker } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Note from "@/components/stour/note";
import {
  CLUB_LOCATION,
  REGATTA_LOCATION,
  MAPPING_APIS,
  CLUB_LOCATION_STRING,
  REGATTA_LOCATION_STRING,
} from "@/lib/constants";
import { NextPage } from "next";
import { makeShareImageURL } from "@/lib/og-image";
import clsx from "clsx";

const openInApp = [
  {
    href: `${MAPPING_APIS.google}${CLUB_LOCATION_STRING}`,
    hrefregatta: `${MAPPING_APIS.google}${REGATTA_LOCATION_STRING}`,
    icon: "/assets/contact/how-to-find-us/google-maps.png",
    name: "Google Maps",
  },
  {
    href: `${MAPPING_APIS.waze}${CLUB_LOCATION_STRING}`,
    hrefregatta: `${MAPPING_APIS.waze}${REGATTA_LOCATION_STRING}`,
    icon: "/assets/contact/how-to-find-us/waze.png",
    name: "Waze",
  },
  {
    href: `${MAPPING_APIS.apple}${CLUB_LOCATION_STRING}`,
    hrefregatta: `${MAPPING_APIS.apple}${REGATTA_LOCATION_STRING}`,
    icon: "/assets/contact/how-to-find-us/apple-maps.png",
    name: "Apple Maps",
  },
];

const maptilerProvider = maptiler(
  "q3gbdmFDPGft7ylWLC6u",
  "uk-openzoomstack-road",
);

type Address = {
  name: "Club" | "Regatta";
  address: string[];
  postcode: string;
};

const addresses: Address[] = [
  {
    name: "Club",
    address: ["Sudbury Rowing Club", "Quay Lane", "Sudbury", "Suffolk"],
    postcode: "CO10 2AN",
  },
  {
    name: "Regatta",
    address: ["Friars Meadow", "Edgeworth Road", "Sudbury", "Suffolk"],
    postcode: "CO10 2TL",
  },
];

const FindUsAddress = ({ name, address, postcode }: Address) => (
  <div>
    <h4 className="mb-1">
      <MapPinIcon
        className={clsx(
          "-ml-0.5 mb-[0.17em] mr-0.5 inline-flex h-6 w-6 sm:-ml-2 md:-ml-0.5 lg:-ml-1.5",
          { Club: "text-blue-500", Regatta: "text-green-500" }[name],
        )}
      />
      {name}
    </h4>
    <p>
      <address className="not-italic">
        {address.map((line, i) => (
          <span key={line}>
            {line}
            {i < address.length - 1 ? <br /> : " "}
          </span>
        ))}
        <span className="disambiguate">{postcode}</span>
      </address>
    </p>

    <div className="my-4 flex space-x-3 text-sm">
      {openInApp.map((item) => (
        <a
          key={item.name}
          className="flex rounded-lg p-px"
          href={name === "Club" ? item.href : item.hrefregatta}
          rel="noreferrer"
          target="_blank"
          aria-label={`Open in ${item.name}`}
        >
          <Image
            alt=""
            className="m-0 rounded-lg border"
            height={24}
            src={item.icon}
            width={24}
          />
        </a>
      ))}
    </div>
  </div>
);

const FindUs: NextPage = () => (
  <Layout>
    <NextSeo
      description="Directions to our club and to our regatta"
      openGraph={{
        description: "Directions to our club and to our regatta",
        images: [{ url: makeShareImageURL("How to find us", true) }],
        title: "How to find us",
      }}
      title="How to find us"
    />
    <HeroTitle title="How to find us" color="transparent" />

    <Container>
      <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-2">
        <div>
          <div className="relative z-10 flex overflow-hidden rounded border">
            <Map
              attribution={false}
              defaultCenter={CLUB_LOCATION as [number, number]}
              defaultZoom={14}
              dprs={[1, 2]}
              height={565}
              provider={maptilerProvider}
            >
              <Marker
                anchor={CLUB_LOCATION as [number, number]}
                color="#0070F3"
                width={50}
              />
              <Marker
                anchor={REGATTA_LOCATION as [number, number]}
                color="rgb(16, 185, 129)"
                width={30}
              />
            </Map>
          </div>
        </div>

        <div className="prose self-center">
          <p className="text-lg">
            The club is located at the end of Quay Lane, a few minutes from the
            centre of Sudbury, and next-door to the Quay Theatre. Parking is
            available outside the club gates.
          </p>
          <Note label="Find the Regatta">
            Our Regatta takes place on Friars Meadow, barely 100m from the
            boathouse but cut off from it by waterways. Access to the meadow is
            from Edgworth Road (<span className="disambiguate">CO10 2TL</span>).
            During the regatta, the routes are signposted. We provide parking
            for spectators, trailers and competitors on Friars Meadow.
          </Note>

          <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {addresses.map((address) => (
              <FindUsAddress key={address.name} {...address} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default FindUs;
