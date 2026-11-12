const CLUB_ORIGIN = "https://sudburyrowingclub.org.uk";
const PARAM = "from";
const STORAGE_KEY = "sudburyrc:return-path";

// Plain page paths only: no query string means no route that redirects on a
// parameter (such as the signed /redirect page) can be chained through here.
const PAGE_PATH_REGEX = /^(\/[a-z0-9-]+)*\/?$/;

const toClubUrl = (path: string | null) =>
  path && PAGE_PATH_REGEX.test(path) ? new URL(path, CLUB_ORIGIN) : null;

const readStoredPath = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const rememberArrival = () => {
  const location = new URL(window.location.href);
  const from = location.searchParams.get(PARAM);

  if (from === null) return;

  const url = toClubUrl(from);

  if (url) {
    try {
      sessionStorage.setItem(STORAGE_KEY, url.pathname);
    } catch {
      // Storage can be unavailable (private windows, blocked site data).
    }
  }

  location.searchParams.delete(PARAM);
  history.replaceState(history.state, "", location);
};

export const showReturnLinks = () => {
  rememberArrival();

  const url = toClubUrl(readStoredPath());

  if (!url) return;

  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "[data-return-link]",
  )) {
    link.href = url.href;
    link.closest("[hidden]")?.removeAttribute("hidden");
  }
};
