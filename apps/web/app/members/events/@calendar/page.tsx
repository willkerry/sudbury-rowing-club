import { serversideFetchCompetitions } from "@sudburyrc/api";
import { Suspense } from "react";
import { Loading } from "@/components/stour/loading";
import { EventCalendar } from "./event-calendar";

export const revalidate = 86_400;

const Calendar = async () => {
  const { events, regions } = await serversideFetchCompetitions();

  return (
    <Suspense fallback={<Loading />}>
      <EventCalendar events={events} regions={regions} />
    </Suspense>
  );
};

export default Calendar;
