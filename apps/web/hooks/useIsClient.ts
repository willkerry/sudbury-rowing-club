import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true on every render after that. */
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
