"use client";

import { type ComponentProps, Suspense, useEffect, useState } from "react";
import { ServerOrClientDateFormatter } from "./server-or-client-date-formatter";

export const DateFormatter = ({
  ...props
}: ComponentProps<typeof ServerOrClientDateFormatter>) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Suspense>
      {hydrated && <ServerOrClientDateFormatter {...props} />}
    </Suspense>
  );
};
