const BASE_PATH = "/api/og";

const getAbsolutePath = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${BASE_PATH}`;
  }

  return `http://localhost:3000${BASE_PATH}`;
};

export const makeShareImageURL = (title: string, absolute: boolean = false) => {
  const url = new URL(absolute ? getAbsolutePath() : BASE_PATH);
  url.search = new URLSearchParams({ title }).toString();

  return url.toString();
};
