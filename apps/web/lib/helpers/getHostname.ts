const removeWww = (hostname: string) => {
  if (hostname.startsWith("www.")) {
    return hostname.slice(4);
  }
  return hostname;
};

const removeQuery = (hostname: string) => {
  if (hostname.includes("?")) {
    return hostname.split("?")[0];
  }
  return hostname;
};

export const getHostname = (url: string) => {
  const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
  return removeQuery(removeWww(urlWithoutProtocol.split("/")[0]));
};
