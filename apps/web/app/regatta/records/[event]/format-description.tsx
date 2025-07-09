import { formatVerboseDuration, type Record } from "../transformRecords";
import { extendEventName, formatClubAndCrewName, listFormatter } from "./utils";

const distanceFormatter = new Intl.NumberFormat("en-GB", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
});

export const detectCourseLength = (record: Record): 350 | 650 =>
  // All eights race on the 350m course
  record.boat.includes("8") ||
  // There's a record for an adaptive/arms-only mixed elite 1x race on the 350m course
  (record.boat.includes("1") && record.time.minutes < 2) ||
  // There’s at least one event who's name includes a '(350m)'
  record.event.includes("350m")
    ? 350
    : 650;

export const formatLocalisedCourseLength = (course: 350 | 650): string =>
  distanceFormatter.format(course);

export const detectAndFormatCourseLength = (record: Record): string => {
  const course = detectCourseLength(record);

  return formatLocalisedCourseLength(course);
};

export const formatDescription = (records: Record[]): string => {
  const holder = records[0];
  const matchers = records.slice(1);

  const course = detectCourseLength(holder);

  const localisedCourseLength = formatLocalisedCourseLength(course);

  const isHeldByMultipleClubs = records.length > 1;

  const eventDescription = `The ${extendEventName(holder.event)} event is contested over the ${localisedCourseLength} course.`;
  const recordDescription = `The record is held by ${formatClubAndCrewName(holder.club, true)}, who set a time of ${formatVerboseDuration(holder.time)} in ${holder.year.getFullYear()}.`;
  const matchedDescription = isHeldByMultipleClubs
    ? ` It was matched by ${listFormatter.format(
        matchers.map(
          ({ club, year }) =>
            `${formatClubAndCrewName(club)} in ${year.getFullYear()}`,
        ),
      )}.`
    : "";

  return [eventDescription, recordDescription, matchedDescription].join(" ");
};
