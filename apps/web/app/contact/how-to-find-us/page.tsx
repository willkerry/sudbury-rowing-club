import Container from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CLUB_LOCATION,
  CLUB_LOCATION_STRING,
  MAPPING_APIS,
  REGATTA_LOCATION,
  REGATTA_LOCATION_STRING,
} from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { MapPinIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { NextPage } from "next";
import Image from "next/image";
import { LocationMap } from "./location-map";

export const metadata = createMetadata({
  title: "How to find us",
  description: "Directions to our club and to our regatta",
});

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
        aria-hidden
        className={clsx(
          "-ml-0.5 sm:-ml-2 md:-ml-0.5 lg:-ml-1.5 mr-0.5 mb-[0.17em] inline-flex h-6 w-6",
          { Club: "text-blue-500", Regatta: "text-green-500" }[name],
        )}
      />
      {name}
    </h4>

    <address className="not-italic">
      {address.map((line, i) => (
        <span key={line}>
          {line}
          {i < address.length - 1 ? <br /> : " "}
        </span>
      ))}
      <span className="disambiguate">{postcode}</span>
    </address>

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
  <>
    <PageHeader title="How to find us" />

    <Container>
      <div className="grid grid-cols-1 gap-16 pb-10 sm:py-10 md:grid-cols-2">
        <div>
          <div className="relative z-10 flex overflow-hidden rounded-sm border">
            <LocationMap
              defaultCenter={CLUB_LOCATION as [number, number]}
              markers={[
                {
                  anchor: CLUB_LOCATION as [number, number],
                  color: "#0070F3",
                  width: 50,
                },
                {
                  anchor: REGATTA_LOCATION as [number, number],
                  color: "rgb(16, 185, 129)",
                  width: 30,
                },
              ]}
            />
          </div>
        </div>

        <div className="prose self-center">
          <p className="text-lg">
            The club is located at the end of Quay Lane, a few minutes from the
            centre of Sudbury, and next-door to the Quay Theatre. Parking is
            available outside the club gates.
          </p>
          <Alert variant="default">
            <AlertTitle>Find the regatta</AlertTitle>
            <AlertDescription>
              Our regatta takes place on Friars Meadow, barely 100m from the
              boathouse but cut off from it by waterways. Access to the meadow
              is from Edgworth Road (
              <span className="disambiguate">CO10 2TL</span>). During the
              regatta, the routes are signposted. We provide parking for
              spectators, trailers and competitors on Friars Meadow. The
              What3Words address for the regatta is{" "}
              <a
                href="https://w3w.co/craziest.flask.falls"
                rel="noreferrer"
                target="_blank"
              >
                {"///craziest.flask.falls"}
              </a>
              .
            </AlertDescription>
          </Alert>

          <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {addresses.map((address) => (
              <FindUsAddress key={address.name} {...address} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  </>
);

export default FindUs;
