const RESULTS_ORIGIN = "https://results.sudburyrowingclub.org.uk";

/** Tells the results archive which page to offer a way back to. */
export const withReturnPath = (href: string, returnPath: string) => {
  try {
    const url = new URL(href);

    if (url.origin !== RESULTS_ORIGIN) return href;

    url.searchParams.set("from", returnPath);

    return url.toString();
  } catch {
    return href;
  }
};
