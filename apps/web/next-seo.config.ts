import { HOME_OG_IMAGE_URL } from "./lib/constants";

const SEO = {
  openGraph: {
    locale: "en_GB",
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

export default SEO;
