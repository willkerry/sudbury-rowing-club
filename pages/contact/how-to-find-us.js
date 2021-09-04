import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Image from "next/image";

import { Map, Marker } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import Note from "@/components/stour/note";
import { MapPin } from "react-feather";
import { LocationMarkerIcon } from "@heroicons/react/solid";

const apis = {
  google: "https://www.google.com/maps/search/?api=1&query=",
  waze: "https://waze.com/ul?ll=",
  apple: "https://maps.apple.com/?address=",
};
const clubLocation = {
  lat: 52.033997,
  long: 0.727634,
};
const regattaLocation = {
  lat: 52.035273,
  long: 0.730891,
};
const openInApp = [
  {
    name: "Google Maps",
    href: apis.google + clubLocation.lat + "," + clubLocation.long,
    hrefregatta: apis.google + regattaLocation.lat + "," + regattaLocation.long,
    icon: "/assets/contact/how-to-find-us/google-maps.png",
  },
  {
    name: "Waze",
    href: apis.waze + clubLocation.lat + "," + clubLocation.long,
    hrefregatta: apis.waze + regattaLocation.lat + "," + regattaLocation.long,
    icon: "/assets/contact/how-to-find-us/waze.png",
  },
  {
    name: "Apple Maps",
    href: apis.apple + clubLocation.lat + "," + clubLocation.long,
    hrefregatta: apis.apple + regattaLocation.lat + "," + regattaLocation.long,
    icon: "/assets/contact/how-to-find-us/apple-maps.png",
  },
];

const maptilerProvider = maptiler(
  "q3gbdmFDPGft7ylWLC6u",
  "uk-openzoomstack-road"
);

export default function FindUs({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>How to find us</title>
      </Head>
      <HeroTitle title="How to find us" />

      <Container>
        <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-2">
          <div>
            <div className="relative z-10 flex overflow-hidden border rounded-lg">
              <Map
                provider={maptilerProvider}
                dprs={[1, 2]}
                height={565}
                defaultCenter={[clubLocation.lat, clubLocation.long]}
                defaultZoom={14}
                attribution={false}
              >
                <Marker
                  width={50}
                  anchor={[clubLocation.lat, clubLocation.long]}
                  color="#0070F3"
                />
                <Marker
                  width={30}
                  anchor={[regattaLocation.lat, regattaLocation.long]}
                  color="rgb(16, 185, 129)"
                />
              </Map>
            </div>
          </div>

          <div className="self-center prose">
            <p className="text-lg">
              The club is located at the end of Quay Lane, a few minutes from
              the centre of Sudbury, and next-door to the Quay Theatre. Parking
              is available outside the club gates.
            </p>
            <Note label="Find the Regatta">
              Our Regatta takes place on Friars Meadow, barely 100m from the
              boathouse but cut off from it by waterways. Access to the meadow
              is from Edgworth Road (CO10 2TL). During the regatta, the routes
              are signposted. We provide parking for spectators, trailers and
              competitors on Friars Meadow.
            </Note>

            <div className="grid lg:grid-cols-2">
              <div>
                <h4>
                  <LocationMarkerIcon className="inline-flex w-6 h-6 mb-0.5 text-blue-500" />
                  Club
                </h4>
                <p>
                  Sudbury Rowing Club
                  <br />
                  Quay Lane
                  <br />
                  Sudbury
                  <br />
                  Suffolk CO10 2AN
                </p>
                <div className="flex my-4 space-x-3 text-sm">
                  {openInApp.map((item) => (
                    <a
                      className="flex p-px bg-gray-200 rounded-lg"
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      title={"Open in " + item.name}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        height={24}
                        width={24}
                        className="border rounded-lg"
                        layout="fixed"
                      />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4>
                  <LocationMarkerIcon className="inline-flex w-6 h-6 mb-0.5 text-green-500" />
                  Regatta
                </h4>
                <p>
                  Friars Meadow
                  <br />
                  Edgeworth Road
                  <br />
                  Sudbury
                  <br />
                  Suffolk CO10 2TL
                </p>
                <div className="flex my-4 space-x-3 text-sm">
                  {openInApp.map((item) => (
                    <a
                      className="flex p-px bg-gray-200 rounded-lg"
                      key={item.name}
                      href={item.hrefregatta}
                      target="_blank"
                      rel="noreferrer"
                      title={"Open in " + item.name}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        height={24}
                        width={24}
                        className="border rounded-lg"
                        layout="fixed"
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
}
