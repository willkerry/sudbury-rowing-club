"use client";

import Center from "@/components/stour/center";
import { Error as ErrorComponent } from "@/components/ui/error";

const LandingPageError = ({ error }: { error: Error }) => (
  <Center className="my-12 rounded border px-4 py-8">
    <ErrorComponent error={error} label={error.name} />
  </Center>
);

export default LandingPageError;
