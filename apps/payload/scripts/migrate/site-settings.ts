import { getPayloadClient } from "./lib/payload-client";

// Seed siteSettings + the regatta-related new fields on the Regatta global
// from the hard-coded values that currently live in
// apps/web/lib/constants.ts. The web side can then read these from Payload
// rather than the constants module; the constants file becomes redundant.
//
// Idempotent: re-running overwrites with the same values (no merge).

const payload = await getPayloadClient();

await payload.updateGlobal({
  data: {
    address: {
      country: "United Kingdom",
      locality: "Sudbury",
      mapUrl: "https://maps.app.goo.gl/coRAF77w6s6BabJB7",
      postalCode: "CO10 2TN",
      region: "Suffolk",
      streetAddress: "Quay Lane",
    },
    club: {
      email: "enquiries@sudburyrowingclub.org.uk",
      foundingDate: "1874-01-01",
      name: "Sudbury Rowing Club",
    },
    location: {
      lat: 52.033997,
      lng: 0.727634,
    },
    regattaLocation: {
      lat: 52.035273,
      lng: 0.730891,
    },
    sender: {
      email: "noreply@sudburyrowingclub.org.uk",
      name: "Sudbury Rowing Club",
    },
    socials: [
      {
        handle: "@sudburyrowingclubuk",
        href: "https://www.instagram.com/sudburyrowingclubuk",
        platform: "instagram",
      },
      {
        handle: "@sudburyrowing",
        href: "https://www.facebook.com/profile.php?id=61561414559766",
        platform: "facebook",
      },
    ],
  } as never,
  slug: "siteSettings",
});

// Drop the existing Regatta global's new fields in too (preserves the rest).
const current = await payload.findGlobal({ slug: "regatta" });
await payload.updateGlobal({
  data: {
    ...current,
    liveResultsUrl: "https://live.sudburyrowingclub.org.uk/",
    testimonialsSection: {
      description:
        "Some of the people who’ve come to our regatta have said lovely things about it",
      title: "Feedback",
    },
    venue: {
      county: "Suffolk",
      name: "Friars Meadow",
      postcode: "CO10 2TL",
      street: "Edgeworth Road",
      town: "Sudbury",
    },
  } as never,
  slug: "regatta",
});

console.log(
  "[site-settings] seeded siteSettings + Regatta venue/testimonials/liveResultsUrl",
);
process.exit(0);
