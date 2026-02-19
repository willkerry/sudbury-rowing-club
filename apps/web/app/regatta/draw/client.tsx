"use client";

import { RadioTowerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateFormatter } from "@/components/utils/date-formatter";
import { REGATTA } from "@/lib/constants";
import { getFirstInstanceOfGivenDayInMonth } from "@/lib/helpers/getFirstInstanceOfGivenDayInMonth";

const getDrawInformation = (
  year: number,
  weekDayOfRegatta: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  monthOfRegatta: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
  weekDayOfDrawPublication: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  hourOfDrawPublication: number,
) => {
  const dateOfRegatta = getFirstInstanceOfGivenDayInMonth(
    year,
    weekDayOfRegatta,
    monthOfRegatta,
  );

  const daysToSubtract = (weekDayOfRegatta - weekDayOfDrawPublication + 7) % 7;

  return {
    showDrawFrom: new Date(dateOfRegatta).setDate(
      dateOfRegatta.getDate() - daysToSubtract,
    ),
    showNextYearPlaceholderFrom:
      new Date(dateOfRegatta).getTime() + 7 * 24 * 60 * 60 * 1000,
    showResultsFrom: new Date(dateOfRegatta).setHours(hourOfDrawPublication),
    showThisYearPlaceholderFrom: new Date(year, 0, 1).getTime(),
  };
};

type State = "thisYearPlaceholder" | "nextYearPlaceholder" | "draw" | "results";

const getStateText = (state: State, date: Date) =>
  ({
    draw: {
      button: "View this year’s draw",
      paragraph: (
        <>
          This year’s draw is now available. Over the course of the regatta, the
          draw will be updated with results after each division.
        </>
      ),
    },
    nextYearPlaceholder: {
      button: "Check anyway",
      paragraph: (
        <>
          The publication date for next year’s draw will be announced in the
          months before the regatta.
        </>
      ),
    },
    results: {
      button: "View this year’s results",
      paragraph: <>This year’s draw is now populating with live results.</>,
    },
    thisYearPlaceholder: {
      button: "Check anyway",
      paragraph: (
        <>
          This year that is expected to be{" "}
          <DateFormatter dateString={date} format="long" timeZone="utc" />.
        </>
      ),
    },
  })[state];

export const ClientDraw = ({
  weekDayOfRegatta,
  monthOfRegatta,
  weekDayOfDrawPublication,
  hourOfDrawPublication,
  thisYearsDrawIsPublished,
}: {
  weekDayOfRegatta: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  monthOfRegatta: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  weekDayOfDrawPublication: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hourOfDrawPublication: number;
  thisYearsDrawIsPublished: boolean;
}) => {
  const thisYear = new Date().getFullYear();
  const {
    showThisYearPlaceholderFrom,
    showDrawFrom,
    showResultsFrom,
    showNextYearPlaceholderFrom,
  } = getDrawInformation(
    thisYear,
    weekDayOfRegatta,
    monthOfRegatta,
    weekDayOfDrawPublication,
    hourOfDrawPublication,
  );

  const now = Date.now();

  const state: State = (() => {
    if (now > showThisYearPlaceholderFrom && !thisYearsDrawIsPublished)
      return "thisYearPlaceholder";
    if (now > showNextYearPlaceholderFrom) return "nextYearPlaceholder";
    if (now > showDrawFrom && !thisYearsDrawIsPublished) return "draw";
    if (now > showDrawFrom && thisYearsDrawIsPublished) return "draw";
    if (now > showResultsFrom) return "results";
    return "results";
  })();

  const { paragraph, button } = getStateText(state, new Date(showDrawFrom));

  return (
    <>
      <p>
        Each year, the Sudbury Regatta draw is published to{" "}
        <a
          href={REGATTA.LIVE_RESULTS_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {new URL(REGATTA.LIVE_RESULTS_URL).hostname}
        </a>{" "}
        the week before the regatta.
      </p>
      <p>{paragraph}</p>
      <p className="py-4">
        <Button asChild icon={<RadioTowerIcon />} size="lg">
          <a
            href={REGATTA.LIVE_RESULTS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            {button}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </Button>
      </p>
    </>
  );
};
