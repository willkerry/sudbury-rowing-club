"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/stour/label";
import { Loading } from "@/components/stour/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectDefaultDayIndex } from "@/lib/forecast/select-default-day";
import { toLondonDate } from "@/lib/forecast/to-forecast-days";
import { trpc } from "@/lib/trpc/client";
import { ForecastSlotColumn } from "./forecast-slot";

const WEEKEND = [0, 6];

const tabFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
});

const isWeekend = (date: string) =>
  WEEKEND.includes(new Date(date).getUTCDay());

export const HourlyForecast = () => {
  const { data: days, status } = trpc.safety.hourlyForecast.useQuery();
  const [selected, setSelected] = useState<string>();
  const stripRef = useRef<HTMLDivElement>(null);

  const defaultDate = useMemo(() => {
    if (!days?.length) return;

    return days[selectDefaultDayIndex(days, new Date())].date;
  }, [days]);

  const active = selected ?? defaultDate;
  const today = toLondonDate(new Date());

  useEffect(() => {
    if (active !== defaultDate) return;

    stripRef.current
      ?.querySelector("[data-now='true']")
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active, defaultDate]);

  if (status === "error" || (status === "success" && !days?.length))
    return null;

  return (
    <div className="overflow-hidden rounded-sm border">
      <div className="border-b p-3 sm:p-4">
        <Label as="h2">Forecast</Label>
      </div>

      <Loading visible={status === "pending"}>
        {days && active && (
          <Tabs onValueChange={setSelected} value={active}>
            <TabsList className="w-full justify-start overflow-x-auto rounded-none border-b bg-gray-50 p-0">
              {days.map((day) => (
                <TabsTrigger
                  className={isWeekend(day.date) ? "font-bold" : undefined}
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
              <TabsContent key={day.date} value={day.date}>
                <div
                  className="flex overflow-x-auto py-3"
                  ref={day.date === active ? stripRef : undefined}
                >
                  {day.slots.map((slot, index) => (
                    <ForecastSlotColumn
                      key={slot.time.toISOString()}
                      now={day.date === defaultDate && index === 0}
                      slot={slot}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </Loading>

      <p className="border-t bg-gray-50 p-3 text-gray-500 text-xs sm:p-4">
        Forecast data from{" "}
        <a className="underline" href="https://www.met.no/en">
          MET Norway
        </a>
        , licensed{" "}
        <a
          className="underline"
          href="https://creativecommons.org/licenses/by/4.0/"
        >
          CC BY 4.0
        </a>
        . Weather icons by{" "}
        <a className="underline" href="https://github.com/metno/weathericons">
          Yr
        </a>
        , MIT.
      </p>
    </div>
  );
};
