"use client";

import type { BREvent } from "@sudburyrc/api";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Label } from "@/components/stour/label";
import { Link as StourLink } from "@/components/stour/link";
import { Select } from "@/components/ui/select";
import { DateFormatter } from "@/components/utils/date-formatter";
import { useFilter } from "@/hooks/useFilter";
import { HOSTNAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-xs border bg-gray-50 p-0.5 font-semibold text-gray-400 text-xs leading-none transition-colors first-of-type:-ml-0.5 group-hover:text-gray-500">
    {children}
  </span>
);

const EventCard = ({
  event: { id, competition, startDate, notes, region, cancelled, url },
}: {
  event: BREvent;
}) => {
  const cardContent = (
    <>
      <h3 className="mb-0.5 line-clamp-1 font-semibold text-sm group-hover:text-blue-500">
        {competition}
      </h3>

      <DateFormatter
        className="mb-2 block font-semibold text-gray-500 text-xs leading-none"
        dateString={startDate}
      />
      <div className="mb-2 font-semibold text-orange-600 text-xs">{notes}</div>

      <div className="flex flex-wrap gap-2">
        <Tag>{region}</Tag>
        {cancelled && <Tag>Cancelled</Tag>}
      </div>
    </>
  );

  return (
    <motion.li
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{ opacity: 0 }}
      id={id}
      initial={{ opacity: 0 }}
      key={id}
      layout="position"
    >
      {url ? (
        <Link
          className={cn(
            "grid rounded-sm border bg-white px-2 py-1.5",
            cancelled && "opacity-50",
            "group transition-colors hover:border-blue-300",
          )}
          href={url}
        >
          {cardContent}
        </Link>
      ) : (
        <div
          className={cn(
            "grid rounded-sm border bg-white px-2 py-1.5",
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
): {
  month: number;
  events: BREvent[];
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

const ALL_REGIONS = "All";

export const EventCalendar = ({
  events = [],
  regions = [],
}: {
  events: BREvent[];
  regions: string[];
}) => {
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
      <div className="mb-4 grid grid-cols-1 items-end md:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {groupByMonth(filteredEvents).map(({ month, events }) => (
            <motion.div
              animate={{
                opacity: 1,
                transition: { duration: 0.5 },
              }}
              exit={{ opacity: 0 }}
              id={`month-${month + 1}`}
              initial={{ opacity: 0 }}
              key={month}
            >
              <Label as="h2" className="mb-2 p-2 text-xs">
                <DateFormatter
                  dateString={events[0].startDate}
                  format={{ month: "long", year: "numeric" }}
                />
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
