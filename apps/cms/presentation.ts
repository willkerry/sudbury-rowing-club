import { defineLocations, presentationTool } from "sanity/presentation";

// CI points a PR's Studio at that PR's web preview.
const previewOrigin =
  import.meta.env.SANITY_STUDIO_PREVIEW_URL ??
  "https://sudburyrowingclub.org.uk";

const fixed = (locations: { href: string; title: string }[]) =>
  defineLocations({ locations });

const governance = fixed([{ href: "/governance", title: "Governance" }]);

const regatta = fixed([
  { href: "/regatta", title: "Regatta" },
  { href: "/regatta/entries", title: "Entry information" },
  { href: "/regatta/events", title: "Event information" },
  { href: "/regatta/results", title: "Regatta results" },
  { href: "/regatta/course", title: "Regatta course" },
  { href: "/regatta/competitor-information", title: "Competitor information" },
]);

const locations = {
  archive: defineLocations({
    resolve: (doc) =>
      doc && {
        locations: [
          { href: `/150/gallery/${doc._id}`, title: doc.title ?? "Archive" },
          { href: "/150/gallery", title: "Anniversary gallery" },
        ],
      },
    select: { _id: "_id", title: "title" },
  }),
  author: defineLocations({
    resolve: (doc) =>
      doc && {
        locations: [
          {
            href: `/news-meta/author/${doc._id}`,
            title: [doc.firstName, doc.surname].filter(Boolean).join(" "),
          },
        ],
      },
    select: { _id: "_id", firstName: "firstName", surname: "surname" },
  }),
  committees: governance,
  members: defineLocations({
    resolve: (doc) =>
      doc?.slug && {
        locations: [
          { href: `/members/${doc.slug}`, title: doc.title ?? "Notice" },
          { href: "/members", title: "Notices" },
        ],
      },
    select: { slug: "slug.current", title: "title" },
  }),
  news: defineLocations({
    resolve: (doc) =>
      doc?.slug && {
        locations: [
          { href: `/news/${doc.slug}`, title: doc.title ?? "Article" },
          { href: "/news", title: "News" },
          { href: "/", title: "Home" },
        ],
      },
    select: { slug: "slug.current", title: "title" },
  }),
  officers: governance,
  regattaSettings: regatta,
  regattas: fixed([
    { href: "/regatta", title: "Regatta" },
    { href: "/regatta/galleries", title: "Official regatta photography" },
  ]),
  safety: defineLocations({
    resolve: (doc) =>
      doc && {
        locations: [
          { href: `/safety/${doc._id}`, title: doc.title ?? "Safety" },
          { href: "/safety", title: "Safety" },
        ],
      },
    select: { _id: "_id", title: "title" },
  }),
  safetyStatus: fixed([{ href: "/safety", title: "Safety" }]),
  siteSettings: fixed([
    { href: "/", title: "Home" },
    { href: "/governance", title: "Governance" },
  ]),
  trustees: governance,
  vicePresidents: governance,
};

export const presentation = presentationTool({
  previewUrl: {
    initial: previewOrigin,
    previewMode: {
      disable: "/api/draft-mode/disable",
      enable: "/api/draft-mode/enable",
    },
  },
  resolve: { locations },
});
