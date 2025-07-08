/**
 * De-relativise a relative URL without accidentally adding a `//` at the join point.
 */
export const combineURLs = (baseURL: string, relativeURL?: string): string =>
  relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "").replace(/\/+$/, "")}`
    : baseURL;
