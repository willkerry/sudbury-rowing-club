import { useReopenCookieBanner } from "@/hooks/useCookieBanner";

export const CookieSettings = () => {
  const reopenCookieBanner = useReopenCookieBanner();

  return (
    <button
      type="button"
      className="transition-colors hover:text-black"
      onClick={reopenCookieBanner}
    >
      Open cookie settings.
    </button>
  );
};
