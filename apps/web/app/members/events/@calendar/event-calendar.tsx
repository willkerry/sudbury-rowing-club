"use client";

import { useState } from "react";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { Select } from "@/components/ui/select";
import DateFormatter from "@/components/utils/date-formatter";
import useFilter from "@/hooks/useFilter";
import { HOSTNAME } from "@/lib/constants";
import { getHostname } from "@/lib/helpers/getHostname";
import type { SRCEvent } from "@sudburyrc/api";
import { AnimatePresence, LayoutGroup } from "motion/react";
import * as motion from "motion/react-client";

const BR_EVENT_STATUS = {
  2: "",
  8: "Cancelled",
} as const;

type Event = SRCEvent;

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-sm border bg-gray-50 p-0.5 text-xs font-semibold leading-none text-gray-400 first-of-type:-ml-0.5">
    {children}
  </span>
);

const EventCard = ({
  event: { id, competition, startDate, notes, region, status, url },
}: {
  event: Event;
}) => (
  <motion.li
    layout="position"
    id={id}
    key={id}
    className={`grid bg-white border rounded px-2 py-1.5 ${status === 8 ? "opacity-50" : ""}`}
    animate={{
      transition: { duration: 0.3 },
      opacity: 1,
    }}
    exit={{ opacity: 0 }}
    initial={{ opacity: 0 }}
  >
    <h3 className="mb-0.5 line-clamp-1 text-sm font-semibold">{competition}</h3>
    <DateFormatter
      dateString={startDate}
      className="mb-2 block text-xs font-semibold leading-none text-gray-500"
    />
    <div className="mb-2 text-xs font-semibold text-orange-600">{notes}</div>

    <div className="flex flex-wrap gap-2">
      <Tag>{region}</Tag>
      {status === 8 && <Tag>{BR_EVENT_STATUS[status]}</Tag>}

      {url && (
        <Link href={url} external className="text-xs font-semibold">
          {getHostname(url)}
        </Link>
      )}
    </div>
  </motion.li>
);

const groupByMonth = (
  events: Event[],
): {
  month: number;
  events: Event[];
}[] => {
  const months = new Set(
    events.map((event) => new Date(event.startDate).getMonth()),
  );

  return Array.from(months).map((month) => ({
    month,
    events: events.filter(
      (event) => new Date(event.startDate).getMonth() === month,
    ),
  }));
};

export const EventCalendar = ({ events }: { events: Event[] }) => {
  const regions = new Set(events?.map((event) => event.region));
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    "Eastern",
  );

  const filteredEvents = useFilter(
    events || [],
    "region",
    selectedRegion || "",
  );

  return (
    <>
      <div className="mb-4 grid grid-cols-1 items-end md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Select
            id="region"
            aria-label="Filter by region"
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions ? (
              <>
                <option value="">All</option>
                {Array.from(regions).map((region) => (
                  <option value={region} key={region}>
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
          <Link href={`webcal://${HOSTNAME}/api/events.ics`} external>
            Subscribe to iCal feed
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <AnimatePresence>
          {groupByMonth(filteredEvents).map(({ month, events }, i) => (
            <motion.div
              id={`month-${month + 1}`}
              key={month}
              animate={{
                transition: { duration: 0.5 },
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <Label as="h2" className="mb-2 p-2 text-xs">
                {new Date(events[0].startDate).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Label>

              <motion.ul className="mb-8 grid gap-2">
                {events.map((event) => (
                  <EventCard {...{ event }} key={event.id} />
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
