"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** How far ahead of the viewport a plan starts loading, so it’s ready by the time it scrolls in. */
const LOAD_AHEAD = "600px";

/** Holds a plan’s place at its own proportions, with room for the legend beneath it. */
const Placeholder = ({ aspect }: { aspect: string }) => (
  <div aria-hidden className="overflow-hidden">
    <div
      className="w-full min-w-140 rounded-sm border border-current/20"
      style={{ aspectRatio: aspect }}
    />
    <div className="mt-4 h-8" />
  </div>
);

const ClubPlan = dynamic(() => import("./club-plan").then((m) => m.ClubPlan), {
  ssr: false,
  loading: () => <Placeholder aspect="1724 / 1090" />,
});

const RiverPlan = dynamic(
  () => import("./river-plan").then((m) => m.RiverPlan),
  { ssr: false, loading: () => <Placeholder aspect="1960 / 989" /> },
);

/** Mounts its plan only once it nears the viewport, as the plans are heavy to load and draw. */
const WhenNear = ({
  aspect,
  children,
  className,
}: {
  aspect: string;
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: LOAD_AHEAD },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={ref}>
      {near ? children : <Placeholder aspect={aspect} />}
    </div>
  );
};

export const LazyClubPlan = ({ className }: { className?: string }) => (
  <WhenNear aspect="1724 / 1090" className={className}>
    <ClubPlan />
  </WhenNear>
);

export const LazyRiverPlan = ({ className }: { className?: string }) => (
  <WhenNear aspect="1960 / 989" className={className}>
    <RiverPlan />
  </WhenNear>
);
