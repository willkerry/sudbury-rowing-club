import { NameEmail } from "./sendMail";

export const HOME_OG_IMAGE_URL =
  "https://sudburyrowingclub.org.uk/assets/og/og.jpg";
export const BASE_URL = "https://sudburyrowingclub.org.uk/";
export const PROJECT_NAME = "Sudbury Rowing Club";
export const LOGO = `${BASE_URL}/favicon/android-chrome-512x512.png`;
export const EMAIL = "enquiries@sudburyrowingclub.org.uk";

export const CLUB_LOCATION = [52.033997, 0.727634];
export const CLUB_LOCATION_STRING = `${CLUB_LOCATION[0]},${CLUB_LOCATION[1]}`;
export const REGATTA_LOCATION = [52.035273, 0.730891];
export const REGATTA_LOCATION_STRING = `${REGATTA_LOCATION[0]},${REGATTA_LOCATION[1]}`;

export const MAPPING_APIS = {
  google: "https://www.google.com/maps/search/?api=1&query=",
  waze: "https://waze.com/ul?ll=",
  apple: "https://maps.apple.com/?address=",
};

export const SENDER: NameEmail = {
  email: "noreply@sudburyrowingclub.org.uk",
  name: "Sudbury Rowing Club",
};
