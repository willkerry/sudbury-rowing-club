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
  BASE_URL,
  CLUB_LOCATION,
  REGATTA_LOCATION,
  MAPPING_APIS,
  CLUB_LOCATION_STRING,
  REGATTA_LOCATION_STRING,
} from "@/lib/constants";
import { NextPage } from "next";

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
  "uk-openzoomstack-road"
);

const FindUs: NextPage = () => (
  <Layout>
    <NextSeo
      description="Directions to our club and to our regatta"
      openGraph={{
        description: "Directions to our club and to our regatta",
        images: [{ url: `${BASE_URL}/assets/og/how-to-find-us.png` }],
        title: "How to find us",
      }}
      title="How to find us"
    />
    <HeroTitle title="How to find us" />

    <Container>
      <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-2">
        <div>
          <div className="relative z-10 flex overflow-hidden border rounded">
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

        <div className="self-center prose">
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

          <div className="grid lg:grid-cols-2">
            <div>
              <h4>
                <MapPinIcon className="inline-flex w-6 h-6 mb-0.5 text-blue-500" />
                Club
              </h4>
              <p>
                Sudbury Rowing Club
                <br />
                Quay Lane
                <br />
                Sudbury
                <br />
                Suffolk <span className="disambiguate">CO10 2AN</span>
              </p>
              <div className="flex my-4 space-x-3 text-sm">
                {openInApp.map((item) => (
                  <a
                    key={item.name}
                    className="flex p-px rounded-lg"
                    href={item.href}
                    rel="noreferrer"
                    target="_blank"
                    title={`Open in ${item.name}`}
                  >
                    <Image
                      alt={item.name}
                      className="m-0 border rounded-lg"
                      height={24}
                      src={item.icon}
                      width={24}
                    />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>
                <MapPinIcon className="inline-flex w-6 h-6 mb-0.5 text-green-500" />
                Regatta
              </h4>
              <p>
                Friars Meadow
                <br />
                Edgeworth Road
                <br />
                Sudbury
                <br />
                Suffolk <span className="disambiguate">CO10 2TL</span>
              </p>
              <div className="flex my-4 space-x-3 text-sm">
                {openInApp.map((item) => (
                  <a
                    key={item.name}
                    className="flex p-px rounded-lg"
                    href={item.hrefregatta}
                    rel="noreferrer"
                    target="_blank"
                    title={`Open in ${item.name}`}
                  >
                    <Image
                      alt={item.name}
                      className="m-0 border rounded-lg"
                      height={24}
                      src={item.icon}
                      width={24}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default FindUs;
