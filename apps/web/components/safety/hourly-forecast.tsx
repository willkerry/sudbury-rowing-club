"use client";

import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectDefaultDayIndex } from "@/lib/forecast/select-default-day";
import {
  type ForecastSlot,
  toLondonDate,
} from "@/lib/forecast/to-forecast-days";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ForecastSlotColumn } from "./forecast-slot";

const MS_PER_HOUR = 3_600_000;

const SOURCES_ID = "forecast-sources";

const tabFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
});

const coversNow = (slot: ForecastSlot, now: number): boolean => {
  const start = slot.time.getTime();

  return now >= start && now < start + slot.span * MS_PER_HOUR;
};

const COARSE_DAY_SLOTS = 4;

const StripSkeleton = () => (
  <div aria-hidden className="flex gap-1 overflow-hidden px-1 py-3">
    {Array.from({ length: 12 }, (_, index) => (
      <div
        className="h-24 w-20 shrink-0 animate-pulse rounded-xs bg-white/5 motion-reduce:animate-none"
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

  if (status === "error" || (status === "success" && !days?.length))
    return null;

  return (
    <section
      aria-label="Weather forecast"
      className="bg-linear-to-br from-gray-950 to-blue-950"
    >
      {status === "pending" ? (
        <StripSkeleton />
      ) : (
        days &&
        active && (
          <Tabs onValueChange={setSelected} value={active}>
            <div className="flex items-center border-white/10 border-b">
              <TabsList
                className={cn(
                  "h-auto min-w-0 flex-1 justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-1 text-white/50",
                )}
              >
                {days.map((day) => (
                  <TabsTrigger
                    className="ring-offset-blue-950 transition-colors hover:text-white/80 focus-visible:ring-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none"
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
                className="mr-1 shrink-0 rounded-sm p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
                className="fade-in mt-0 animate-in ring-offset-blue-950 duration-200 focus-visible:ring-white/60 motion-reduce:animate-none"
                key={activeDay.date}
                value={activeDay.date}
              >
                <Carousel
                  className={cn("mask-r-from-90% mask-r-to-100%", "relative")}
                  opts={{
                    skipSnaps: true,
                    startIndex: activeDay.slots.findIndex(
                      (slot) => slot.time.getHours() === 6,
                    ),
                  }}
                >
                  <CarouselContent>
                    {activeDay.slots.map((slot) => (
                      <CarouselItem
                        className={cn(
                          "shrink-0",
                          activeDay.slots.length > COARSE_DAY_SLOTS
                            ? "basis-20"
                            : "basis-1/4",
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
        <p className="overflow-hidden px-3 text-white/40 text-xs sm:px-4">
          <span className="block border-white/10 border-t py-3">
            Forecast data from{" "}
            <a
              className="underline hover:text-white/70"
              href="https://www.met.no/en"
            >
              MET Norway
            </a>
            , licensed{" "}
            <a
              className="underline hover:text-white/70"
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0
            </a>
            . Weather icons by{" "}
            <a
              className="underline hover:text-white/70"
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
