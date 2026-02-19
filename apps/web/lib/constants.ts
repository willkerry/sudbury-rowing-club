import type { SportsClub, WithContext } from "schema-dts";

export const HOSTNAME = "sudburyrowingclub.org.uk";

export const HOME_OG_IMAGE_URL = `https://${HOSTNAME}/assets/og/og.jpg`;
export const BASE_URL = `https://${HOSTNAME}`;
export const PROJECT_NAME = "Sudbury Rowing Club";
export const LOGO = `${BASE_URL}/favicon/android-chrome-512x512.png`;
export const EMAIL = "enquiries@sudburyrowingclub.org.uk";

export const CLUB_LOCATION = [52.033997, 0.727634];
export const CLUB_LOCATION_STRING = `${CLUB_LOCATION[0]},${CLUB_LOCATION[1]}`;
export const REGATTA_LOCATION = [52.035273, 0.730891];
export const REGATTA_LOCATION_STRING = `${REGATTA_LOCATION[0]},${REGATTA_LOCATION[1]}`;

export const MAPPING_APIS = {
  apple: "https://maps.apple.com/?address=",
  google: "https://www.google.com/maps/search/?api=1&query=",
  waze: "https://waze.com/ul?ll=",
};

export const SENDER = {
  email: "noreply@sudburyrowingclub.org.uk",
  name: "Sudbury Rowing Club",
};

export const SUPPORTED_SOCIALS = ["instagram", "facebook"] as const;

export const SOCIALS: Record<
  (typeof SUPPORTED_SOCIALS)[number],
  { name: string; href: string; handle: string }
> = {
  facebook: {
    handle: "@sudburyrowing",
    href: "https://www.facebook.com/profile.php?id=61561414559766",
    name: "Facebook",
  },
  instagram: {
    handle: "@sudburyrowingclubuk",
    href: "https://www.instagram.com/sudburyrowingclubuk",
    name: "Instagram",
  },
} as const;

export namespace REGATTA {
  export const EVENT_NAME_LONG =
    "Sudbury Rowing Club Regatta, the ‘International’";
  export const EVENT_TAGLINE = "The best little regatta in the world.";

  export const OG_IMAGE_URL = `${BASE_URL}/assets/og/regatta.png`;
  export const CANONICAL_URL = `${BASE_URL}/regatta`;

  export const VENUE = "Friars Meadow";
  export const STREET = "Edgeworth Road";
  export const TOWN = "Sudbury";
  export const COUNTY = "Suffolk";
  export const POSTCODE = "CO10 2TL";

  export const TESTIMONIAL_TITLE = "Feedack";
  export const TESTIMONIAL_DESCRIPTION =
    "Some of the people who’ve come to our regatta have said lovely things about it";

  export const LIVE_RESULTS_URL = "https://live.sudburyrowingclub.org.uk/";
}

export const ClubJsonLd: WithContext<SportsClub> = {
  "@context": "https://schema.org",
  "@id": BASE_URL,
  "@type": "SportsClub",
  email: EMAIL,
  foundingDate: "1874-01-01",
  hasMap: "https://maps.app.goo.gl/coRAF77w6s6BabJB7",
  isicV4: "9312",
  logo: LOGO,
  name: PROJECT_NAME,
  url: BASE_URL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "United Kingdom",
    addressLocality: "Sudbury",
    addressRegion: "Suffolk",
    postalCode: "CO10 2TN",
    streetAddress: "Quay Lane",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CLUB_LOCATION[0],
    longitude: CLUB_LOCATION[1],
  },
};
