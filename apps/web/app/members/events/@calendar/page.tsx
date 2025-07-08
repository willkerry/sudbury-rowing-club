import { Loading } from "@/components/stour/loading";
import { serversideFetchCompetitions } from "@sudburyrc/api";
import { Suspense } from "react";
import { EventCalendar } from "./event-calendar";

export const revalidate = 86_400;

const Calendar = async () => {
  const events = await serversideFetchCompetitions(false);

  return (
    <Suspense fallback={<Loading />}>
      <EventCalendar events={events} />
    </Suspense>
  );
};

export default Calendar;
