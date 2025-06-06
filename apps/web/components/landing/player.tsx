"use client";

import {
  EllipsisHorizontalCircleIcon,
  ExclamationCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { useThrottledCallback } from "@mantine/hooks";
import { useRef, useState } from "react";

type PlayerState = "idle" | "playing" | "paused" | "loading" | "error";

const controlIcons: Record<PlayerState, typeof PlayCircleIcon> = {
  idle: PlayCircleIcon,
  loading: EllipsisHorizontalCircleIcon,
  paused: PlayCircleIcon,
  playing: PauseCircleIcon,
  error: ExclamationCircleIcon,
};

const controlText: Record<PlayerState, string> = {
  idle: "Play video",
  loading: "Loading video",
  paused: "Play video",
  playing: "Pause video",
  error: "Error",
};

const Player = () => {
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
          ref={ref}
          className="absolute inset-0 z-0 aspect-h-9 aspect-w-16 w-full"
          autoPlay
          muted
          loop
          onPlaying={setPlaying}
          onEnded={setIdle}
          onError={setError}
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
        disabled={playerState === "loading"}
        onClick={handleClick}
        type="button"
        className="absolute right-3 bottom-3 z-10 text-white"
      >
        <Icon aria-hidden className="h-6 w-6" />
        <div className="sr-only">{text}</div>
      </button>
    </div>
  );
};

export default Player;
