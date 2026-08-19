"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/stour/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectDefaultDayIndex } from "@/lib/forecast/select-default-day";
import {
  type ForecastSlot,
  toLondonDate,
} from "@/lib/forecast/to-forecast-days";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ForecastSlotColumn } from "./forecast-slot";

const MS_PER_HOUR = 3_600_000;

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const tabFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
});

const coversNow = (slot: ForecastSlot, now: number): boolean => {
  const start = slot.time.getTime();

  return now >= start && now < start + slot.span * MS_PER_HOUR;
};

const StripSkeleton = () => (
  <div aria-hidden className="flex gap-1 px-1 py-3">
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

  const defaultDate = useMemo(() => {
    if (!days?.length) return;

    return days[selectDefaultDayIndex(days, new Date())].date;
  }, [days]);

  const active = selected ?? defaultDate;
  const today = toLondonDate(new Date());
  const now = Date.now();

  if (status === "error" || (status === "success" && !days?.length))
    return null;

  return (
    <section
      aria-label="Weather forecast"
      className="overflow-hidden rounded-sm bg-linear-to-br from-gray-950 to-blue-950"
    >
      <div className="border-white/10 border-b px-3 py-3 sm:px-4">
        <Label as="h2" className="text-white/60">
          Forecast
        </Label>
      </div>

      {status === "pending" ? (
        <StripSkeleton />
      ) : (
        days &&
        active && (
          <Tabs onValueChange={setSelected} value={active}>
            <TabsList
              className={cn(
                "h-auto w-full justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-none border-white/10 border-b bg-transparent p-1 text-white/50",
                HIDE_SCROLLBAR,
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

            {days.map((day) => (
              <TabsContent
                className="fade-in mt-0 animate-in ring-offset-blue-950 duration-200 focus-visible:ring-white/60 motion-reduce:animate-none"
                key={day.date}
                value={day.date}
              >
                <div
                  className={cn(
                    "flex snap-x snap-mandatory overflow-x-auto",
                    "mask-r-from-90% mask-r-to-100%",
                    HIDE_SCROLLBAR,
                  )}
                >
                  {day.slots.map((slot) => (
                    <ForecastSlotColumn
                      isNow={coversNow(slot, now)}
                      key={slot.time.toISOString()}
                      slot={slot}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )
      )}

      <p className="border-white/10 border-t px-3 py-3 text-white/40 text-xs sm:px-4">
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
      </p>
    </section>
  );
};
