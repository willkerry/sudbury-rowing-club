export default {
  name: "figure",
  title: "Figure",
  type: "object",
  fields: [
    {
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      description:
        "Describe the image for users who cannot see it (e.g. due to visual impairment). This is a very important accessibility provision, so please don’t skip it. ",
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
      description:
        "Optionally provide a supporting caption for all users. (e.g. subjects’ names or the location).",
    },
  ],
};
