"use client";

import { browserIndexOfficers } from "@/lib/algolia";
import { useHotkeys, useOs, useThrottledCallback } from "@mantine/hooks";
import type { OfficerResponse } from "@sudburyrc/api";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type ExternalToast, toast } from "sonner";
import { Button } from "../ui/button";
import type { Message } from "./contactForm";

const TESTING_MODE_TOAST_OPTIONS: ExternalToast = {
  id: "testing-mode",
  position: "top-center",
};

export const useTestingMode = (form: ReactFormExtendedApi<Message>) => {
  const os = useOs();
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: getWodehouseFullDetails } = useQuery({
    enabled: isEnabled,
    queryKey: ["getWodehouseFullDetails"],
    queryFn: () => import("get-wodehouse-name"),
    select: ({ getWodehouseFullDetails }) => getWodehouseFullDetails,
  });

  const { data: webmasterId } = useQuery({
    enabled: isEnabled,
    queryKey: ["webmasterId"],
    queryFn: () => browserIndexOfficers.search<OfficerResponse>("WEBMASTER"),
    select: (data) => data.hits[0]?._id,
  });

  const { refetch: setFieldValues } = useQuery({
    enabled: isEnabled && !!getWodehouseFullDetails,
    queryKey: ["setFieldValues"],
    queryFn: getWodehouseFullDetails,
    select: ({ firstName, lastName, email }) => {
      const name = `${firstName} ${lastName}`;

      form.setFieldValue("to", webmasterId ?? "");
      form.setFieldValue("name", name);
      form.setFieldValue("email", email);

      return undefined;
    },
  });

  const handleHotkey = useThrottledCallback(async () => {
    if (isEnabled) {
      await setFieldValues();
      toast.success("New sender generated.", {
        position: "top-center",
      });

      return;
    }

    const didConfirm = await new Promise<boolean>((resolve) => {
      toast("Enable testing mode?", {
        ...TESTING_MODE_TOAST_OPTIONS,
        description: (
          <div className="text-gray-700">
            You can activate testing mode by pressing{" "}
            {os === "macos" ? <kbd>⌘+J</kbd> : <kbd>Ctrl+J</kbd>}.
          </div>
        ),
        onDismiss: () => resolve(false),
        onAutoClose: () => resolve(false),
        action: (
          <Button onClick={() => resolve(true)} size="xs" autoFocus>
            Enable
          </Button>
        ),
      });
    });

    if (!didConfirm) return;

    toast.loading("Loading testing mode...", {
      ...TESTING_MODE_TOAST_OPTIONS,
      action: undefined,
      description: undefined,
    });

    setIsEnabled(true);
    await setFieldValues();

    toast.success("Testing mode enabled.", TESTING_MODE_TOAST_OPTIONS);
  }, 300);

  useHotkeys([["mod+j", handleHotkey]]);
};
