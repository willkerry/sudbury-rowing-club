import { cachedFetchCompetitions, cachedFetchRegions } from "@sudburyrc/api";
import { Suspense } from "react";
import { Loading } from "@/components/stour/loading";
import { EventCalendar } from "./event-calendar";

export const revalidate = 86_400;

const Calendar = async () => {
  const events = await cachedFetchCompetitions();
  const regions = await cachedFetchRegions();

  return (
    <Suspense fallback={<Loading />}>
      <EventCalendar events={events} regions={regions} />
    </Suspense>
  );
};

export default Calendar;
