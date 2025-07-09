"use client";

import { useHotkeys, useOs, useThrottledCallback } from "@mantine/hooks";
import type { OfficerResponse } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type ExternalToast, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBrowserClient, OFFICERS_INDEX_NAME } from "@/lib/algolia";
import type { Message } from "./contactForm";

const TESTING_MODE_TOAST_OPTIONS = {
  id: "testing-mode",
} satisfies ExternalToast;

export const useTestingMode = ({
  setValues,
}: {
  setValues: (values: Pick<Message, "to" | "name" | "email">) => void;
}) => {
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
    queryFn: () =>
      getBrowserClient().searchForHits<OfficerResponse>({
        requests: [
          {
            indexName: OFFICERS_INDEX_NAME,
            query: "WEBMASTER",
          },
        ],
      }),
    select: (data) => data.results[0]?.hits[0]?._id,
  });

  const { refetch: setFieldValues } = useQuery({
    enabled: isEnabled && !!getWodehouseFullDetails,
    queryKey: ["setFieldValues"],
    queryFn: getWodehouseFullDetails ?? (() => Promise.resolve(undefined)),
    select: (details) => {
      if (!details) return;

      const { firstName, lastName, email } = details;
      const name = `${firstName} ${lastName}`;

      setValues({ to: webmasterId ?? "", name, email });

      return undefined;
    },
  });

  const handleHotkey = useThrottledCallback(async () => {
    if (isEnabled) {
      await setFieldValues();
      toast.success("New sender generated.");

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
