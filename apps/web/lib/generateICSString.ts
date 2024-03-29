import { SRCEvent } from "@sudburyrc/api";

const dateToiCalDayFormat = (date: Date) =>
  date.toISOString().replace(/T.*/, "").replace(/-/g, "");

const generateICSString = (events: SRCEvent[]) => {
  const preamble = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SRC//Events//EN
X-WR-CALNAME:SRC Events
X-WR-TIMEZONE:Europe/London
X-WR-CALDESC:Events from the British Rowing Calendar`;

  const icsString = events.reduce(
    (acc, event) =>
      `${acc}
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${new Date(event.startDate).toISOString().replace(/[-:]/g, "")}
DTSTART:${dateToiCalDayFormat(new Date(event.startDate))}
SUMMARY:${event.competition}
DESCRIPTION:${event.notes || ""}
LOCATION:${event.region}
URL:${event.url || ""}
STATUS:${
        event.notes?.toLowerCase().includes("cancelled")
          ? "CANCELLED"
          : "CONFIRMED"
      }
END:VEVENT
`,
    preamble,
  );

  return `${icsString}END:VCALENDAR`;
};

export default generateICSString;
