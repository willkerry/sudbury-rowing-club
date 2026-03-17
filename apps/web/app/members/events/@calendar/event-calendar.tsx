"use client";

import type { BREvent } from "@sudburyrc/api";
import { ArrowUpRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Label } from "@/components/stour/label";
import { Link as StourLink } from "@/components/stour/link";
import { Select } from "@/components/ui/select";
import { DateFormatter } from "@/components/utils/date-formatter";
import { useFilter } from "@/hooks/useFilter";
import { HOSTNAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const Tag = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "cancelled";
}) => (
  <span
    className={cn(
      "rounded-xs border p-0.5 font-semibold text-xs leading-none transition-colors first-of-type:-ml-0.5",
      variant === "cancelled"
        ? "border-red-200 bg-red-50 text-red-400 group-hover:text-red-500"
        : "bg-gray-50 text-gray-400 group-hover:text-gray-500",
    )}
  >
    {children}
  </span>
);

const EventCard = ({
  event: { id, competition, startDate, notes, region, cancelled, url },
  index,
}: {
  event: BREvent;
  index: number;
}) => {
  const reducedMotion = useReducedMotion() ?? false;

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-1">
        <h3
          className={cn(
            "mb-0.5 line-clamp-1 font-semibold text-sm",
            url && "group-hover:text-blue-500",
            cancelled && "line-through decoration-gray-300",
          )}
        >
          {competition}
        </h3>
        {url && (
          <ArrowUpRightIcon className="mt-0.5 size-3 shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
        )}
      </div>

      <DateFormatter
        className="mb-2 block font-semibold text-gray-500 text-xs leading-none"
        dateString={startDate}
      />
      {notes && (
        <div className="mb-2 text-gray-500 text-xs italic">{notes}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <Tag>{region}</Tag>
        {cancelled && <Tag variant="cancelled">Cancelled</Tag>}
      </div>
    </>
  );

  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      id={id}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      key={id}
      transition={{
        delay: reducedMotion ? 0 : index * 0.04,
        duration: 0.25,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      {url ? (
        <Link
          className={cn(
            "group grid rounded-sm border bg-white px-2 py-1.5",
            cancelled && "opacity-50",
            "transition-[colors,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm",
          )}
          href={url}
        >
          {cardContent}
        </Link>
      ) : (
        <div
          className={cn(
            "grid rounded-sm border border-dashed bg-white px-2 py-1.5",
            cancelled && "opacity-50",
          )}
        >
          {cardContent}
        </div>
      )}
    </motion.li>
  );
};

const groupByMonth = (
  events: BREvent[],
): { month: number; events: BREvent[] }[] => {
  const grouped = new Map<number, BREvent[]>();

  for (const event of events) {
    const month = new Date(event.startDate).getMonth();
    const list = grouped.get(month);

    if (list) {
      list.push(event);
    } else {
      grouped.set(month, [event]);
    }
  }

  return Array.from(grouped, ([month, events]) => ({ month, events }));
};

const ALL_REGIONS = "All";

export const EventCalendar = ({
  events = [],
  regions = [],
}: {
  events: BREvent[];
  regions: string[];
}) => {
  const reducedMotion = useReducedMotion() ?? false;

  const [selectedRegion, setSelectedRegion] = useQueryState<string>("region", {
    defaultValue: "Eastern",
    parse: (value) => value || "Eastern",
  });

  const filteredEvents = useFilter(
    events,
    "region",
    selectedRegion,
    ALL_REGIONS.toLowerCase(),
  );

  return (
    <>
      <div className="mb-4 grid grid-cols-1 items-center justify-between gap-2 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Select
            aria-label="Filter by region"
            onChange={(e) => setSelectedRegion(e.target.value)}
            value={selectedRegion || ""}
          >
            {regions.length > 0 ? (
              <>
                <option value={ALL_REGIONS.toLowerCase()}>{ALL_REGIONS}</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No regions found.</option>
            )}
          </Select>
        </div>

        <div className="hidden sm:block" />

        <div className="flex justify-end pt-3">
          <StourLink external href={`webcal://${HOSTNAME}/api/events.ics`}>
            Subscribe to iCal feed
          </StourLink>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={selectedRegion}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
        >
          {filteredEvents.length === 0 ? (
            <p className="col-span-full py-8 text-center text-gray-400 text-sm">
              No events found for this region.
            </p>
          ) : (
            groupByMonth(filteredEvents).map(({ month, events }) => (
              <div id={`month-${month + 1}`} key={month}>
                <Label as="h2" className="mb-2 p-2 text-xs">
                  <DateFormatter
                    dateString={events[0].startDate}
                    format={{ month: "long", year: "numeric" }}
                  />
                </Label>

                <ul className="mb-8 grid gap-2">
                  {events.map((event, i) => (
                    <EventCard event={event} index={i} key={event.id} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
