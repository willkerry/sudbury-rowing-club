import { LocationMarkerIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Map, Marker } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Note from "@/components/stour/note";
import { BASE_URL } from "@/lib/constants";

const apis = {
  google: "https://www.google.com/maps/search/?api=1&query=",
  waze: "https://waze.com/ul?ll=",
  apple: "https://maps.apple.com/?address=",
};
const clubLocation = [52.033997, 0.727634];
const regattaLocation = [52.035273, 0.730891];
const locationStrings = [
  `${clubLocation[0]},${clubLocation[1]}`,
  `${regattaLocation[0]},${regattaLocation[1]}`,
];
const openInApp = [
  {
    name: "Google Maps",
    href: `${apis.google}${locationStrings[0]}`,
    hrefregatta: `${apis.google}${locationStrings[1]}`,
    icon: "/assets/contact/how-to-find-us/google-maps.png",
  },
  {
    name: "Waze",
    href: `${apis.waze}${locationStrings[0]}`,
    hrefregatta: `${apis.waze}${locationStrings[1]}`,
    icon: "/assets/contact/how-to-find-us/waze.png",
  },
  {
    name: "Apple Maps",
    href: `${apis.apple}${locationStrings[0]}`,
    hrefregatta: `${apis.apple}${locationStrings[1]}`,
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
      <NextSeo
        title="How to find us"
        description="Directions to our club and to our regatta"
        openGraph={{
          title: "How to find us",
          description: "Directions to our club and to our regatta",
          imafes: [{ url: `${BASE_URL}/assets/og/how-to-find-us.png` }],
        }}
      />
      <HeroTitle title="How to find us" />

      <Container>
        <div className="grid grid-cols-1 gap-16 py-10 md:grid-cols-2">
          <div>
            <div className="relative z-10 flex overflow-hidden border rounded">
              <Map
                provider={maptilerProvider}
                dprs={[1, 2]}
                height={565}
                defaultCenter={clubLocation}
                defaultZoom={14}
                attribution={false}
              >
                <Marker width={50} anchor={clubLocation} color="#0070F3" />
                <Marker
                  width={30}
                  anchor={regattaLocation}
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
                      title={`Open in ${item.name}`}
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
                      title={`Open in ${item.name}`}
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
