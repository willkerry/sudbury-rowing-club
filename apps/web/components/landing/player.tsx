"use client";

import { useThrottledCallback } from "@mantine/hooks";
import {
  IconExclamationCircleFilled,
  IconLoader2,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type PlayerState = "idle" | "playing" | "paused" | "loading" | "error";

const controlIcons: Record<PlayerState, typeof IconPlayerPlayFilled> = {
  error: IconExclamationCircleFilled,
  idle: IconPlayerPlayFilled,
  loading: IconLoader2,
  paused: IconPlayerPlayFilled,
  playing: IconPlayerPauseFilled,
};

const controlText: Record<PlayerState, string> = {
  error: "Error",
  idle: "Play video",
  loading: "Loading video",
  paused: "Play video",
  playing: "Pause video",
};

export const Player = () => {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");

  const throttledSetPlayerState = useThrottledCallback(setPlayerState, 100);

  const setError = () => throttledSetPlayerState("error");
  const setIdle = () => throttledSetPlayerState("idle");
  const setLoading = () => throttledSetPlayerState("loading");
  const setPaused = () => throttledSetPlayerState("paused");
  const setPlaying = () => throttledSetPlayerState("playing");

  const ref = useRef<HTMLVideoElement>(null);

  const clickHandlers: Record<PlayerState, () => void> = {
    error: setError,
    idle: setLoading,
    loading: setPaused,
    paused: () => {
      setPlaying();
      ref.current?.play();
    },
    playing: () => {
      setPaused();
      ref.current?.pause();
    },
  };

  const handleClick = () => clickHandlers[playerState]();

  const Icon = controlIcons[playerState];
  const text = controlText[playerState];

  return (
    <div className="absolute inset-0 w-full">
      {playerState !== "idle" && (
        <video
          autoPlay
          className="absolute inset-0 z-0 aspect-h-9 aspect-w-16 w-full"
          loop
          muted
          onEnded={setIdle}
          onPlaying={setPlaying}
          ref={ref}
        >
          <source
            src="https://cdn.sudburyrowingclub.org.uk/media/landing_page_h265.mp4"
            type='video/mp4; codecs="hvc1"'
          />
          <source
            onError={setError}
            src="https://cdn.sudburyrowingclub.org.uk/media/landing_page_h264.mp4"
            type="video/mp4"
          />
        </video>
      )}

      <Button
        className="absolute right-3 bottom-3 z-10 text-white"
        disabled={playerState === "loading"}
        onClick={handleClick}
        size="xs"
        type="button"
        variant="link"
      >
        <Icon
          aria-hidden
          className={cn("size-4", playerState === "loading" && "animate-spin")}
        />
        <div className="sr-only">{text}</div>
      </Button>
    </div>
  );
};
