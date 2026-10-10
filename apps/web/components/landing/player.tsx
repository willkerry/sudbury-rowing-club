"use client";

import { useThrottledCallback } from "@mantine/hooks";
import {
  IconDotsFilled,
  IconExclamationMark,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

type PlayerState = "idle" | "playing" | "paused" | "loading" | "error";

const controlIcons: Record<PlayerState, typeof IconPlayerPlayFilled> = {
  error: IconExclamationMark,
  idle: IconPlayerPlayFilled,
  loading: IconDotsFilled,
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
          onError={setError}
          onPlaying={setPlaying}
          ref={ref}
        >
          <source
            src="https://cdn.sudburyrowingclub.org.uk/media%2Flanding_page_h265.mp4"
            type="video/mp4"
          />
          <source
            src="https://cdn.sudburyrowingclub.org.uk/media%2Flanding_page_h264.mp4"
            type="video/mp4"
          />
        </video>
      )}

      <button
        className="absolute right-3 bottom-3 z-10 text-white"
        disabled={playerState === "loading"}
        onClick={handleClick}
        type="button"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-white text-gray-900">
          <Icon aria-hidden className="size-3.5" stroke={2.5} />
        </span>
        <div className="sr-only">{text}</div>
      </button>
    </div>
  );
};
