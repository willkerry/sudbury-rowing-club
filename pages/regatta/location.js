import { LocationMarkerIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Map, Marker } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
// import Note from "@/components/stour/note";
import { BASE_URL } from "@/lib/constants";
import Note from "@/components/stour/note";

const apis = {
  google: "https://www.google.com/maps/search/?api=1&query=",
  waze: "https://waze.com/ul?ll=",
  apple: "https://maps.apple.com/?address=",
};

const regattaLocation = [52.035273, 0.730891];
const locationString = [`${regattaLocation[0]},${regattaLocation[1]}`];
const openInApp = [
  {
    name: "Google Maps",
    href: `${apis.google}${locationString}`,
    icon: "/assets/contact/how-to-find-us/google-maps.png",
  },
  {
    name: "Waze",
    href: `${apis.waze}${locationString}`,
    icon: "/assets/contact/how-to-find-us/waze.png",
  },
  {
    name: "Apple Maps",
    href: `${apis.apple}${locationString}`,
    icon: "/assets/contact/how-to-find-us/apple-maps.png",
  },
];

const maptilerProvider = maptiler(
  "q3gbdmFDPGft7ylWLC6u",
  "uk-openzoomstack-road"
);

export default function FindUs() {
  return (
    <Layout>
      <NextSeo
        description="Directions to our club and to our regatta"
        openGraph={{
          title: "How to find us",
          description: "Directions to our club and to our regatta",
          imafes: [{ url: `${BASE_URL}/assets/og/how-to-find-us.png` }],
        }}
        title="How to find us"
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
                defaultCenter={regattaLocation}
                defaultZoom={14}
                attribution={false}
              >
                <Marker anchor={regattaLocation} color="#0070F3" width={50} />
              </Map>
            </div>
          </div>

          <div className="self-center prose">
            <p className="lead">
              Our regatta takes place on <strong>Friar’s Meadow</strong>.
            </p>
            <Note label="Driving">
              Vehicular access to the meadow is from Edgeworth Road. The
              coordinates provided here are for the car access point. Paid
              parking is readily available on the meadow (during the regatta).
            </Note>
            <Note label="Public transport">
              The regatta is very short walk from Sudbury station. The station
              is the terminus of a branch line accessed at Marks Tey, which is a
              stop on frequent services from Liverpool Street.
            </Note>
            <Note label="Pedestrian access">
              There are many access points to Friars Meadow – you are free to
              come and go through any of them.
            </Note>
            <Note label="Boat trailers">
              Follow the driving directions to the meadow.
            </Note>
            <div className="grid lg:grid-cols-2">
              <div>
                <h4>
                  <LocationMarkerIcon className="inline-flex w-6 h-6 mb-0.5 text-blue-500" />
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
