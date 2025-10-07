const RELATIVE_URL_REGEX = /^\/+/;
const TRAILING_SLASH_REGEX = /\/+$/;

/**
 * De-relativise a relative URL without accidentally adding a `//` at the join point.
 */
export const combineURLs = (baseURL: string, relativeURL?: string): string =>
  relativeURL
    ? `${baseURL.replace(TRAILING_SLASH_REGEX, "")}/${relativeURL.replace(RELATIVE_URL_REGEX, "").replace(TRAILING_SLASH_REGEX, "")}`
    : baseURL;
