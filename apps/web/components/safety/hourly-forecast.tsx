"use client";

import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerOrClientDateFormatter } from "@/components/utils/server-or-client-date-formatter";
import { toLondonDate } from "@/lib/forecast/london-time";
import { selectDefaultDayIndex } from "@/lib/forecast/select-default-day";
import { selectStartSlotIndex } from "@/lib/forecast/select-start-slot";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ForecastSlotColumn } from "./forecast-slot";

const MS_PER_HOUR = 3_600_000;

const SOURCES_ID = "forecast-sources";

const coversNow = (slot: ForecastSlot, now: number): boolean => {
  const start = slot.time.getTime();

  return now >= start && now < start + slot.span * MS_PER_HOUR;
};

const StripSkeleton = () => (
  <div aria-hidden className="flex gap-1 overflow-hidden px-1 py-3">
    {Array.from({ length: 12 }, (_, index) => (
      <Skeleton
        className="h-24 w-20 shrink-0 rounded-xs motion-reduce:animate-none"
        key={`skeleton-${index}`}
        style={{ animationDelay: `${index * 60}ms` }}
      />
    ))}
  </div>
);

export const HourlyForecast = () => {
  const { data: days, status } = trpc.safety.hourlyForecast.useQuery(
    undefined,
    {
      trpc: { context: { unbatched: true } },
    },
  );
  const [selected, setSelected] = useState<string>();
  const [sourcesShown, setSourcesShown] = useState(false);

  const defaultDate = useMemo(() => {
    if (!days?.length) return;

    return days[selectDefaultDayIndex(days, new Date())].date;
  }, [days]);

  // A refetch can drop the selected day, so fall back rather than leave an
  // empty strip under a tab list with nothing highlighted.
  const active =
    selected && days?.some((day) => day.date === selected)
      ? selected
      : defaultDate;
  const activeDay = days?.find((day) => day.date === active);
  const today = toLondonDate(new Date());
  const now = Date.now();
  const isCoarse = (activeDay?.slots.length ?? 0) <= 6;

  if (status === "error" || (status === "success" && !days?.length))
    return null;

  return (
    <section aria-label="Weather forecast" className="bg-gray-50">
      {status === "pending" ? (
        <StripSkeleton />
      ) : (
        days &&
        active && (
          <Tabs onValueChange={setSelected} value={active}>
            <div className="flex items-center border-b">
              <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-1">
                {days.map((day) => (
                  <TabsTrigger key={day.date} value={day.date}>
                    {day.date === today ? (
                      "Today"
                    ) : (
                      <ServerOrClientDateFormatter
                        dateString={day.date}
                        format="shortWeekday"
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <button
                aria-controls={SOURCES_ID}
                aria-expanded={sourcesShown}
                className="mr-1 shrink-0 rounded-sm p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
                asChild
                className="fade-in relative mt-0 animate-in ring-offset-blue-50 duration-200 focus-visible:ring-gray-900/60 motion-reduce:animate-none"
                key={activeDay.date}
                value={activeDay.date}
              >
                <Carousel
                  opts={{
                    skipSnaps: true,
                    startIndex: selectStartSlotIndex(activeDay.slots),
                  }}
                >
                  <CarouselContent className={isCoarse ? "" : "pl-4"}>
                    {activeDay.slots.map((slot) => (
                      <CarouselItem
                        className={cn(
                          "shrink-0",
                          isCoarse ? "basis-1/4" : "basis-14",
                        )}
                        key={slot.time.toISOString()}
                      >
                        <ForecastSlotColumn
                          isNow={coversNow(slot, now)}
                          slot={slot}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
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
        <p className="overflow-hidden px-3 text-gray-400 text-xs sm:px-4">
          <span className="block border-t py-3">
            Forecast data from{" "}
            <a
              className="underline hover:text-gray-900"
              href="https://www.met.no/en"
            >
              MET Norway
            </a>
            , licensed{" "}
            <a
              className="underline hover:text-gray-900"
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0
            </a>
            . Weather icons by{" "}
            <a
              className="underline hover:text-gray-900"
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
