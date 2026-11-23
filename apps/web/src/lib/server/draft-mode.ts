// `next/headers` resolves to this module; `draftMode()` itself marks every page
// that calls it as uncacheable, so public renders must not call it.
import { getActiveDraftModeState } from "vinext/shims/headers";

export const STUDIO_URL = "https://edit.sudburyrowingclub.org.uk";

export const isDraftModeRequest = async () =>
  getActiveDraftModeState() ?? false;
