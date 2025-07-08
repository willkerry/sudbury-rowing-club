"use client";

import { type ComponentProps, Suspense, useEffect, useState } from "react";
import { ServerOrClientDateFormatter } from "./server-or-client-date-formatter";

const DateFormatter = ({
  ...props
}: ComponentProps<typeof ServerOrClientDateFormatter>) => {
  const [_, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Suspense>
      <ServerOrClientDateFormatter {...props} />
    </Suspense>
  );
};

export default DateFormatter;
