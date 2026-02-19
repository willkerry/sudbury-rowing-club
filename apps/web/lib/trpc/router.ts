import { router } from "./init";
import { calendarRouter } from "./routers/calendar";
import { commsRouter } from "./routers/comms";
import { contentRouter } from "./routers/content";
import { safetyRouter } from "./routers/safety";

export const appRouter = router({
  calendar: calendarRouter,
  comms: commsRouter,
  content: contentRouter,
  safety: safetyRouter,
});

export type AppRouter = typeof appRouter;
