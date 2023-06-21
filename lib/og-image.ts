const BASE_PATH = "/api/og";

const getBasePath = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${BASE_PATH}`;
  }

  return `http://localhost:3000${BASE_PATH}`;
};

export const makeShareImageURL = (title: string) => {
  const url = new URL(getBasePath());
  url.search = new URLSearchParams({ title }).toString();

  return url.toString();
};
