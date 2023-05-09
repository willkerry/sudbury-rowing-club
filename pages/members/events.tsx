/* eslint-disable jsx-a11y/label-has-associated-control */
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import useEventCalendar from "@/hooks/useEventCalendar";
import DateFormatter from "@/components/utils/date-formatter";
import { useState } from "react";
import Label from "@/components/stour/label";
import { HeroTitle } from "@/components/stour/hero";
import Loading from "@/components/stour/loading";
import Link from "@/components/stour/link";
import useFilter from "@/hooks/useFilter";
import { NextSeo } from "next-seo";

const BR_EVENT_STATUS = {
  2: "",
  8: "Cancelled",
} as const;

type NeverUndefined<T> = T extends undefined ? never : T;
type Event = NeverUndefined<
  ReturnType<typeof useEventCalendar>["data"]
>[number];

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-semibold bg-gray-50 text-gray-400 leading-none border rounded-sm p-0.5 first-of-type:-ml-0.5">
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
    className={`py-1.5 px-2 grid bg-white ${status === 8 ? "opacity-50" : ""}`}
  >
    <h3 className="text-sm font-semibold line-clamp-1 mb-0.5">{competition}</h3>
    <DateFormatter
      dateString={startDate}
      className="text-xs font-semibold text-gray-500 leading-none block mb-2"
    />
    <div className="text-xs font-semibold mb-2 text-orange-600">{notes}</div>

    <div className="flex flex-wrap gap-2">
      <Tag>{region}</Tag>
      {status === 8 && <Tag>{BR_EVENT_STATUS[status]}</Tag>}

      {url && (
        <Link href={url} external className="text-xs font-semibold">
          {new URL(url).hostname.replace("www.", "")}
        </Link>
      )}
    </div>
  </li>
);

const groupByMonth = (
  events: Event[]
): {
  month: number;
  events: Event[];
}[] => {
  const months = new Set(
    events.map((event) => new Date(event.startDate).getMonth())
  );

  return Array.from(months).map((month) => ({
    month,
    events: events.filter(
      (event) => new Date(event.startDate).getMonth() === month
    ),
  }));
};

const EventCalendar = () => {
  const { data: events, isLoading, isError } = useEventCalendar();

  const regions = new Set(events?.map((event) => event.region));
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    "Eastern"
  );

  const filteredEvents = useFilter(
    events || [],
    "region",
    selectedRegion || ""
  );

  return (
    <Layout>
      <NextSeo
        title="Competition Calendar"
        description="This calendar shows competitions for the current season, as recorded by British Rowing."
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
            and are updated twice a day. If in any doubt, consider British
            Rowing the definitive source of information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
          <div>
            <label htmlFor="region">Filter by region</label>
            <select
              id="region"
              value={selectedRegion || ""}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {isLoading && <option value="">Loading...</option>}
              {isError && <option value="">Error loading regions.</option>}
              {!regions ? (
                <option value="">No regions found.</option>
              ) : (
                <>
                  <option value="">All</option>
                  {Array.from(regions).map((region) => (
                    <option value={region} key={region}>
                      {region}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="bg-gray-50 border rounded h-96">
            <Loading />
          </div>
        )}

        {isError && <p>Error loading calendar.</p>}

        {events && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 border rounded ">
            {groupByMonth(filteredEvents).map(({ month, events }) => (
              <div
                id={`month-${month + 1}`}
                key={month}
                className="border-r border-b md:border-b-0 overflow-hidden"
              >
                <Label as="h2" className="mb-2 text-xs p-2">
                  {new Date(events[0].startDate).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </Label>

                <ul className="grid divide-y border-y mb-8">
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
