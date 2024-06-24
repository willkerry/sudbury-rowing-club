"use client";

import Center from "@/components/stour/center";
import { Error } from "@/components/ui/error";

export default function SafetyError({ error }: { error: Error }) {
  return (
    <Center className="my-40">
      <Error error={error} label={error.name} />
    </Center>
  );
}
