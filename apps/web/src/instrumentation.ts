import { configureDraftMode } from "@sudburyrc/api";
import { env } from "@/env";
import { isDraftModeRequest, STUDIO_URL } from "@/lib/server/draft-mode";

export const register = () => {
  if (!env.SANITY_API_READ_TOKEN) return;

  configureDraftMode({
    isEnabled: isDraftModeRequest,
    studioUrl: STUDIO_URL,
    token: env.SANITY_API_READ_TOKEN,
  });
};
