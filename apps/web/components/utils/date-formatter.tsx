"use client";

import { type ComponentProps, useSyncExternalStore } from "react";
import { ServerOrClientDateFormatter } from "./server-or-client-date-formatter";

const subscribe = () => () => {};
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => "Europe/London";

export const DateFormatter = (
  props: ComponentProps<typeof ServerOrClientDateFormatter>,
) => {
  const timeZone = useSyncExternalStore(
    subscribe,
    getTimeZone,
    getServerTimeZone,
  );

  return <ServerOrClientDateFormatter timeZone={timeZone} {...props} />;
};
