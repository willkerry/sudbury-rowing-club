"use client";

import Center from "@/components/stour/center";
import { ErrorMessage } from "@/components/ui/error";

export default function SafetyError({ error }: { error: Error }) {
  return (
    <Center className="my-40">
      <ErrorMessage error={error} label={error.name} />
    </Center>
  );
}
