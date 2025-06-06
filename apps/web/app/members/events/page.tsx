import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  title: "Competition Calendar",
  description:
    "This calendar shows competitions for the current season, as recorded by British Rowing.",
  image: { title: "Competition Calendar 🗓️" },
});

const EventPage = () => (
  <div className="prose mb-12">
    <p>
      This calendar is provided as an ergonomic way for Sudbury members to check
      the dates of upcoming events and competitions. The data displayed here are
      drawn from the British Rowing{" "}
      <a href="https://www.britishrowing.org/competition-calendar/">
        competition calendar
      </a>{" "}
      and are updated twice a day.
    </p>
  </div>
);

export default EventPage;
