"use client";

import { browserIndexOfficers } from "@/lib/algolia";
import { useHotkeys, useOs, useThrottledCallback } from "@mantine/hooks";
import type { OfficerResponse } from "@sudburyrc/api";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import type { getWodehouseFullDetails } from "get-wodehouse-name";
import ky from "ky";
import { useState } from "react";
import { toast } from "sonner";
import type { Message } from "./contactForm";

export const useTestingMode = (form: ReactFormExtendedApi<Message>) => {
  const os = useOs();
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: webmasterId } = useQuery({
    enabled: isEnabled,
    queryKey: ["webmasterId"],
    queryFn: () => browserIndexOfficers.search<OfficerResponse>("WEBMASTER"),
    select: (data) => data.hits[0]?._id,
  });

  const { refetch } = useQuery({
    enabled: isEnabled,
    queryKey: ["/api/pg"],
    queryFn: () =>
      ky.get<ReturnType<typeof getWodehouseFullDetails>>("/api/pg").json(),
    select: ({ firstName, lastName, email }) => {
      const name = `${firstName} ${lastName}`;

      form.setFieldValue("to", webmasterId ?? "");
      form.setFieldValue("name", name);
      form.setFieldValue("email", email);

      return { name, email };
    },
  });

  const handleHotkey = useThrottledCallback(async () => {
    if (isEnabled) {
      await refetch();
      toast("Testing mode sender regenerated.", { position: "top-center" });

      return;
    }

    const didConfirm = await new Promise<boolean>((resolve) => {
      toast("Enable testing mode?", {
        id: "testing-mode",
        description: (
          <div className="text-gray-700">
            You can activate testing mode by pressing{" "}
            {os === "macos" ? <kbd>⌘+J</kbd> : <kbd>Ctrl+J</kbd>}.
          </div>
        ),
        position: "top-center",
        dismissible: true,
        onDismiss: () => resolve(false),
        onAutoClose: () => resolve(false),
        action: {
          label: "Confirm",
          onClick: () => resolve(true),
        },
      });
    });

    if (!didConfirm) return;

    setIsEnabled(true);
  }, 1000);

  useHotkeys([["mod+j", handleHotkey]]);
};
