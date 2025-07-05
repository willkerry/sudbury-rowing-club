const removeWww = (hostname: string) => {
  if (hostname.startsWith("www.")) {
    return hostname.slice(4);
  }
  return hostname;
};

export const getHostname = (url: string) => {
  const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");

  return removeWww(urlWithoutProtocol.split("/")[0]);
};
