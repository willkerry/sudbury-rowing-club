import { BASE_URL } from "@/lib/constants";
import { type ShareImage } from "@/pages/api/og";

const BASE_PATH = "/api/og";

const absoluteUrl = `${BASE_URL}${BASE_PATH}`;

type MakeShareImageURL = (
  title: ShareImage["title"],
  absolute?: boolean,
  options?: Omit<ShareImage, "title">
) => string;

export const makeShareImageURL: MakeShareImageURL = (
  title,
  absolute,
  options
) => {
  const searchParams = new URLSearchParams({ title, ...options }).toString();
  const path = absolute ? absoluteUrl : BASE_PATH;

  return `${path}?${searchParams}`;
};