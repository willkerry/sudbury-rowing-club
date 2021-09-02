import { HOME_OG_IMAGE_URL, BASE_URL } from "/lib/constants";

module.exports = {
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    site_name: "Sudbury Rowing Club",
    images: [
      {
        url: HOME_OG_IMAGE_URL,
      },
    ],
  },
  twitter: {
    handle: "@sudbury_rowing",
    site: "@sudbury_rowing",
    cardType: "summary_large_image",
  },
};
