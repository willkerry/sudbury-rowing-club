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
    showResultsFrom: new Date(dateOfRegatta).setHours(hourOfDrawPublication),
  };
};

type State = "placeholder" | "draw" | "results";

const getStateText = (state: State, date: Date) =>
  ({
    placeholder: {
      paragraph: (
        <>
          This year that is expected to be{" "}
          <DateFormatter timeZone="utc" dateString={date} format="long" />.
        </>
      ),
      button: "Check anyway",
    },
    draw: {
      paragraph: (
        <>
          This year’s draw is now available. Over the course of the regatta, the
          draw will be updated with results after each division.
        </>
      ),
      button: "View this year’s draw",
    },
    results: {
      paragraph: <>This year’s draw is now populating with live results.</>,
      button: "View this year’s results",
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
  const { showDrawFrom, showResultsFrom } = getDrawInformation(
    thisYear,
    weekDayOfRegatta,
    monthOfRegatta,
    weekDayOfDrawPublication,
    hourOfDrawPublication,
  );

  const now = Date.now();

  const state: State = (() => {
    if (now > showDrawFrom && !thisYearsDrawIsPublished) return "placeholder";
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
          target="_blank"
          rel="noopener noreferrer"
        >
          {new URL(REGATTA.LIVE_RESULTS_URL).hostname}
        </a>{" "}
        the week before the regatta.
      </p>
      <p>{paragraph}</p>
      <p className="py-4">
        <Button size="lg" asChild icon={<RadioTowerIcon />}>
          <a
            href={REGATTA.LIVE_RESULTS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {button}
          </a>
        </Button>
      </p>
    </>
  );
};
