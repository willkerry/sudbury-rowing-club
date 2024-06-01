import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { HeroTitle } from "@/components/stour/hero";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import Loading from "@/components/stour/loading";
import DateFormatter from "@/components/utils/date-formatter";
import useFilter from "@/hooks/useFilter";
import { HOSTNAME } from "@/lib/constants";
import { getHostname } from "@/lib/helpers/getHostname";
import { makeShareImageURL } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import type { SRCEvent } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useState } from "react";

const BR_EVENT_STATUS = {
  2: "",
  8: "Cancelled",
} as const;

const fetchCompetitions = async () => {
  const competitions = await fetch("/api/events");

  if (competitions.status !== 200) {
    throw new Error("Failed to fetch competition calendar.");
  }

  return competitions.json() as Promise<SRCEvent[]>;
};

type NeverUndefined<T> = T extends undefined ? never : T;
type Event = NeverUndefined<
  Awaited<ReturnType<typeof fetchCompetitions>>[number]
>;

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="first-of-type:-ml-0.5 rounded-sm border bg-gray-50 p-0.5 font-semibold text-gray-400 text-xs leading-none">
    {children}
  </span>
);

const EventCard = ({
  event: { id, competition, startDate, notes, region, status, url },
}: {
  event: Event;
}) => (
  <li
    {...{ id }}
    key={id}
    className={cn("grid bg-white px-2 py-1.5", status === 8 && "opacity-50")}
  >
    <h3 className="mb-0.5 line-clamp-1 font-semibold text-sm">{competition}</h3>
    <DateFormatter
      dateString={startDate}
      className="mb-2 block font-semibold text-gray-500 text-xs leading-none"
    />
    <div className="mb-2 font-semibold text-orange-600 text-xs">{notes}</div>

    <div className="flex flex-wrap gap-2">
      <Tag>{region}</Tag>
      {status === 8 && <Tag>{BR_EVENT_STATUS[status]}</Tag>}

      {url && (
        <Link href={url} external className="font-semibold text-xs">
          {getHostname(url)}
        </Link>
      )}
    </div>
  </li>
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

const EventCalendar = () => {
  const { data: events, status } = useQuery({
    queryKey: ["competition-calendar"],
    queryFn: fetchCompetitions,
    staleTime: 10 * 60 * 1000,
  });

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
    <Layout>
      <NextSeo
        title="Competition Calendar"
        description="This calendar shows competitions for the current season, as recorded by British Rowing."
        openGraph={{
          title: "Competition Calendar",
          description:
            "This calendar shows competitions for the current season, as recorded by British Rowing.",
          images: [{ url: makeShareImageURL("Competition Calendar 🗓️", true) }],
        }}
      />

      <HeroTitle prose title="Competition Calendar" transparent />

      <Container>
        <div className="prose mx-auto mb-12">
          <p>
            This calendar is provided as an ergonomic way for Sudbury members to
            check the dates of upcoming events and competitions. The data
            displayed here are drawn from the British Rowing{" "}
            <a href="https://www.britishrowing.org/competition-calendar/">
              competition calendar
            </a>{" "}
            and are updated twice a day.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 items-end lg:grid-cols-3 md:grid-cols-2">
          <div>
            <label htmlFor="region">Filter by region</label>
            <select
              id="region"
              value={selectedRegion || ""}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {status === "pending" && <option value="">Loading...</option>}
              {status === "error" && (
                <option value="">Error loading regions.</option>
              )}
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
            </select>
          </div>

          <div className="hidden sm:block" />

          <div className="flex justify-end pt-3">
            <Link href={`webcal://${HOSTNAME}/api/events.ics`} external>
              Subscribe to iCal feed
            </Link>
          </div>
        </div>

        {status === "pending" && (
          <div className="h-96 rounded border bg-gray-50">
            <Loading />
          </div>
        )}

        {status === "error" && <p>Error loading calendar.</p>}

        {events && (
          <div className="grid grid-cols-1 rounded border bg-gray-50 lg:grid-cols-3 md:grid-cols-2">
            {groupByMonth(filteredEvents).map(({ month, events }) => (
              <div
                id={`month-${month + 1}`}
                key={month}
                className="overflow-hidden border-r border-b md:border-b-0"
              >
                <Label as="h2" className="mb-2 p-2 text-xs">
                  {new Date(events[0].startDate).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </Label>

                <ul className="mb-8 grid divide-y border-y">
                  {events.map((event) => (
                    <EventCard {...{ event }} key={event.id} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4" />
      </Container>
    </Layout>
  );
};

export default EventCalendar;
