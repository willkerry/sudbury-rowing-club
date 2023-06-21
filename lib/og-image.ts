import { BASE_URL } from "@/lib/constants";

const BASE_PATH = "/api/og";

const absoluteUrl = `${BASE_URL}${BASE_PATH}`;

export const makeShareImageURL = (title: string, absolute: boolean = false) => {
  const searchParams = new URLSearchParams({ title }).toString();
  const path = absolute ? absoluteUrl : BASE_PATH;

  return `${path}?${searchParams}`;
};
