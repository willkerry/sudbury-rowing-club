import type { CSSProperties } from "react";
import { toLondonDate } from "@/lib/forecast/london-time";
import {
  describeFlow,
  FAST_FLOW,
  HIGH_FLOW,
  type RiverFlow,
  type RiverLevel,
  type RiverReadings,
  toLevelTrend,
  USUAL_FLOW,
} from "@/lib/river-level";
import { formatWhen } from "@/lib/safety-times";
import { cn } from "@/lib/utils";

const MS_PER_DAY = 86_400_000;

// Flow spans two orders of magnitude, so the scale is logarithmic.
const SCALE_MIN = 0.25;
const SCALE_MAX = 30;

const toPercent = (value: number): number => {
  const clamped = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);

  return (
    (Math.log(clamped / SCALE_MIN) / Math.log(SCALE_MAX / SCALE_MIN)) * 100
  );
};

export const formatFlow = (value: number): string =>
  value >= 10 ? String(Math.round(value)) : value.toFixed(1);

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const describeFlowDay = (date: string, now: Date): string => {
  if (date === toLondonDate(new Date(now.getTime() - MS_PER_DAY)))
    return "Yesterday’s average flow";
  if (date === toLondonDate(now)) return "Today’s average flow";

  return `Average flow on ${dayFormatter.format(new Date(date))}`;
};

const BANDS = [
  { className: "bg-gray-200", from: SCALE_MIN, label: "Normal", to: FAST_FLOW },
  {
    className: "bg-yellow-200",
    from: FAST_FLOW,
    label: "Faster",
    to: HIGH_FLOW,
  },
  { className: "bg-yellow-400", from: HIGH_FLOW, label: "High", to: SCALE_MAX },
];

const FlowScale = ({ value }: { value: number }) => (
  <div>
    <div
      aria-label="River flow"
      aria-valuemax={SCALE_MAX}
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuetext={`${formatFlow(value)} cubic metres per second, ${describeFlow(value).headline.toLowerCase()}. Usually ${formatFlow(USUAL_FLOW)}.`}
      className="relative mt-3 h-2"
      role="meter"
    >
      <div className="flex h-full gap-0.5 overflow-hidden rounded-full">
        {BANDS.map(({ className, from, label, to }) => (
          <div
            className={cn("h-full basis-0", className)}
            key={label}
            style={{ flexGrow: toPercent(to) - toPercent(from) }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 translate-x-(--flow) transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none starting:translate-x-0"
        style={{ "--flow": `${toPercent(value)}%` } as CSSProperties}
      >
        <span className="absolute top-1/2 left-0 size-4 -translate-1/2 rounded-full border-2 border-white bg-blue-900" />
      </div>
    </div>

    <div aria-hidden className="mt-1.5 flex gap-0.5 text-xs text-gray-500">
      {BANDS.map(({ from, label, to }) => (
        <span
          className="basis-0 truncate"
          key={label}
          style={{ flexGrow: toPercent(to) - toPercent(from) }}
        >
          {label}
        </span>
      ))}
    </div>
  </div>
);

const LevelTrend = ({ level, now }: { level: RiverLevel; now: Date }) => {
  if (level.hours < 1) return null;

  const trend = toLevelTrend(level.change);
  const span = `${level.hours} hours`;
  const asOf = formatWhen(new Date(level.readAt), now);
  const movement =
    trend === "steady"
      ? `has held steady over the last ${span}`
      : `has ${trend === "rising" ? "risen" : "fallen"} ${Math.abs(level.change)} cm in the last ${span}`;

  return (
    <p
      className={cn(
        "text-sm",
        trend === "rising" ? "font-medium text-gray-900" : "text-gray-500",
      )}
    >
      The level there {movement}, as of {asOf}.
    </p>
  );
};

const FlowReading = ({ flow }: { flow: RiverFlow }) => (
  <>
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p className="text-gray-900">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">
          {formatFlow(flow.value)}
        </span>{" "}
        <span className="text-lg text-gray-600">m³/s</span>
      </p>
      <p className="text-sm text-gray-600 tabular-nums">
        Usually {formatFlow(USUAL_FLOW)} m³/s
      </p>
    </div>

    <FlowScale value={flow.value} />
  </>
);

export const RiverGauge = ({
  now,
  river,
}: {
  now: Date;
  river: RiverReadings;
}) => (
  <figure>
    {river.flow && <FlowReading flow={river.flow} />}

    <figcaption className="mt-3 space-y-1">
      <p className="text-sm text-gray-500">
        {river.flow
          ? `${describeFlowDay(river.flow.date, now)} at ${river.station}, downstream of the club.`
          : `Live readings from ${river.station}, downstream of the club.`}
      </p>
      {river.level && <LevelTrend level={river.level} now={now} />}
    </figcaption>
  </figure>
);
