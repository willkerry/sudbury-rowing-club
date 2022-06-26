const combineURLs = (baseURL: string, relativeURL?: string): string => relativeURL
  ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
  : baseURL;

export default combineURLs;