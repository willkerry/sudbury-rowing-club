/**
 * De-relativise a relative URL without accidentally adding a `//` at the join point.
 */
const combineURLs = (baseURL: string, relativeURL?: string): string =>
  relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "").replace(/\/+$/, "")}`
    : baseURL;
//
export default combineURLs;
