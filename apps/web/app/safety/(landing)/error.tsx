"use client";

import Center from "@/components/stour/center";
import { Error as ErrorComponent } from "@/components/ui/error";

export default function SafetyError({ error }: { error: Error }) {
  return (
    <Center className="my-40">
      <ErrorComponent error={error} label={error.name} />
    </Center>
  );
}
