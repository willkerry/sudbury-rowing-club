"use client";

import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectDefaultDayIndex } from "@/lib/forecast/select-default-day";
import { currentSkyPhase } from "@/lib/forecast/sky-phase";
import { SKY_THEMES } from "@/lib/forecast/sky-theme";
import { coversNow, toLondonDate } from "@/lib/forecast/to-forecast-days";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ForecastSlotColumn } from "./forecast-slot";

const SOURCES_ID = "forecast-sources";

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const tabFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
});

const COARSE_DAY_SLOTS = 4;
const MORNING_HOUR = "06";

const scrollToMorning = (strip: HTMLDivElement | null) => {
  const morning = strip?.querySelector(`[data-hour="${MORNING_HOUR}"]`);

  if (!(strip && morning)) return;

  strip.scrollLeft +=
    morning.getBoundingClientRect().left - strip.getBoundingClientRect().left;
};

const StripSkeleton = ({ className }: { className: string }) => (
  <div aria-hidden className="flex gap-1 overflow-hidden px-1 py-3">
    {Array.from({ length: 12 }, (_, index) => (
      <div
        className={cn(
          "h-24 w-20 shrink-0 animate-pulse rounded-xs motion-reduce:animate-none",
          className,
        )}
        key={`skeleton-${index}`}
        style={{ animationDelay: `${index * 60}ms` }}
      />
    ))}
  </div>
);

export const HourlyForecast = () => {
  const { data: days, status } = trpc.safety.hourlyForecast.useQuery();
  const [selected, setSelected] = useState<string>();
  const [sourcesShown, setSourcesShown] = useState(false);

  const defaultDate = useMemo(() => {
    if (!days?.length) return;

    return days[selectDefaultDayIndex(days, new Date())].date;
  }, [days]);

  const active = selected ?? defaultDate;
  const activeDay = days?.find((day) => day.date === active);
  const today = toLondonDate(new Date());
  const now = Date.now();

  const { ink, ringOffset, surface } =
    SKY_THEMES[days ? currentSkyPhase(days, now) : "night"];

  if (status === "error" || (status === "success" && !days?.length))
    return null;

  return (
    <section
      aria-label="Weather forecast"
      className={cn("transition-colors duration-700", surface)}
    >
      {status === "pending" ? (
        <StripSkeleton className={ink.skeleton} />
      ) : (
        days &&
        active && (
          <Tabs onValueChange={setSelected} value={active}>
            <div className={cn("flex items-center border-b", ink.border)}>
              <TabsList
                className={cn(
                  "h-auto min-w-0 flex-1 justify-start gap-1 rounded-none bg-transparent p-1",
                  "overflow-x-auto overflow-y-hidden",
                  ink.tabIdle,
                  HIDE_SCROLLBAR,
                )}
              >
                {days.map((day) => (
                  <TabsTrigger
                    className={cn(
                      "transition-colors",
                      ringOffset,
                      ink.ring,
                      ink.tabActive,
                    )}
                    key={day.date}
                    value={day.date}
                  >
                    {day.date === today
                      ? "Today"
                      : tabFormatter.format(new Date(day.date))}
                  </TabsTrigger>
                ))}
              </TabsList>

              <button
                aria-controls={SOURCES_ID}
                aria-expanded={sourcesShown}
                className={cn(
                  "mr-1 shrink-0 rounded-sm p-2 transition-colors focus-visible:outline-none focus-visible:ring-2",
                  ink.toggle,
                  ink.ring,
                )}
                onClick={() => setSourcesShown((shown) => !shown)}
                type="button"
              >
                <InfoIcon aria-hidden className="size-4" />
                <span className="sr-only">
                  {sourcesShown ? "Hide data sources" : "Show data sources"}
                </span>
              </button>
            </div>

            {activeDay && (
              <TabsContent
                className={cn(
                  "fade-in mt-0 animate-in duration-200 motion-reduce:animate-none",
                  ringOffset,
                  ink.ring,
                )}
                key={activeDay.date}
                value={activeDay.date}
              >
                <div
                  className={cn(
                    "flex snap-x snap-mandatory overflow-x-auto",
                    "mask-r-from-90% mask-r-to-100%",
                    HIDE_SCROLLBAR,
                  )}
                  ref={
                    activeDay.date !== today &&
                    activeDay.slots.length > COARSE_DAY_SLOTS
                      ? scrollToMorning
                      : undefined
                  }
                >
                  {activeDay.slots.map((slot) => (
                    <ForecastSlotColumn
                      ink={ink}
                      isNow={coversNow(slot, now)}
                      key={slot.time.toISOString()}
                      slot={slot}
                    />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )
      )}

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          sourcesShown ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        id={SOURCES_ID}
      >
        <p
          className={cn(
            "overflow-hidden px-3 text-xs sm:px-4",
            ink.attribution,
          )}
        >
          <span className={cn("block border-t py-3", ink.border)}>
            Forecast data from{" "}
            <a
              className={cn("underline", ink.link)}
              href="https://www.met.no/en"
            >
              MET Norway
            </a>
            , licensed{" "}
            <a
              className={cn("underline", ink.link)}
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0
            </a>
            . Weather icons by{" "}
            <a
              className={cn("underline", ink.link)}
              href="https://github.com/metno/weathericons"
            >
              Yr
            </a>
            , MIT.
          </span>
        </p>
      </div>
    </section>
  );
};
