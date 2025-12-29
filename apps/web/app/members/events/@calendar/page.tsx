import { cachedFetchCompetitions, cachedFetchRegions } from "@sudburyrc/api";
import { Suspense } from "react";
import { Loading } from "@/components/stour/loading";
import { normaliseUrl } from "@/lib/helpers/normaliseUrl";
import { createRedirectUrl } from "@/lib/redirect";
import { EventCalendar } from "./event-calendar";

export const revalidate = 86_400;

const Calendar = async () => {
  const events = await cachedFetchCompetitions();
  const regions = await cachedFetchRegions();

  const eventsWithRedirectUrls = events.map((event) => {
    const normalisedUrl = event.url ? normaliseUrl(event.url) : null;

    return {
      ...event,
      url: normalisedUrl ? createRedirectUrl(normalisedUrl) : null,
    };
  });

  return (
    <Suspense fallback={<Loading />}>
      <EventCalendar events={eventsWithRedirectUrls} regions={regions} />
    </Suspense>
  );
};

export default Calendar;
