import type { ShareImage } from "@/app/api/og/route";
import { BASE_URL } from "@/lib/constants";

const BASE_PATH = "/api/og";

const absoluteUrl = `${BASE_URL}${BASE_PATH}`;

type MakeShareImageURL = (
  title: ShareImage["title"],
  absolute?: boolean,
  options?: Partial<Omit<ShareImage, "title">>,
) => string;

export const makeShareImageURL: MakeShareImageURL = (
  title,
  absolute,
  options,
) => {
  const searchParams = new URLSearchParams({ title, ...options }).toString();
  const path = absolute ? absoluteUrl : BASE_PATH;

  return `${path}?${searchParams}`;
};
