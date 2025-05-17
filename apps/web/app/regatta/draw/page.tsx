import { kyInstance } from "@/app/get-query-client";
import TextPage from "@/components/layouts/text-page";
import { Button } from "@/components/ui/button";
import DateFormatter from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";

const DRAW_URL = "https://live.sudburyrowingclub.org.uk/";

export const revalidate = 86_400;
export const metadata = createMetadata({
  title: `Regatta Draw ${String(new Date().getFullYear())}`,
  description: "Draw for the Sudbury Regatta",
});

const fetchDraw = async () => {
  const today = new Date();
  const thisYear = today.getFullYear();

  const firstSaturdayInAugust = ((year: number) => {
    const firstDayInAugust = new Date(year, 7, 1);
    return new Date(
      firstDayInAugust.setDate(
        firstDayInAugust.getDate() + (6 - firstDayInAugust.getDay()),
      ),
    );
  })(thisYear);

  const mondayBeforeFirstSaturdayInAugust = new Date(
    firstSaturdayInAugust,
  ).setDate(firstSaturdayInAugust.getDate() - 5);

  const tenAMOnFirstSaturdayInAugustInBST = new Date(
    firstSaturdayInAugust,
  ).setHours(10);

  const draw = await kyInstance.get(DRAW_URL).text();

  const thisYearsDrawIsPublished = (() => {
    const drawYear = /20\d\d/.exec(draw)?.[0];
    return drawYear === thisYear.toString();
  })();

  return {
    showDrawFrom: mondayBeforeFirstSaturdayInAugust,
    showResultsFrom: tenAMOnFirstSaturdayInAugustInBST,
    thisYearsDrawIsPublished: await thisYearsDrawIsPublished,
    thisYear,
  };
};

type State = "placeholder" | "draw" | "results";

const getStateText = (state: State, date: Date) =>
  ({
    placeholder: {
      paragraph: (
        <>
          This year that is expected to be approximately{" "}
          <DateFormatter timeZone="utc" dateString={date} format="long" />.
        </>
      ),
      button: "View last year’s draw",
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
      paragraph: <>This year’s draw is now populated with results.</>,
      button: "View this year’s results",
    },
  })[state];

const Draw = async () => {
  const { showDrawFrom, showResultsFrom, thisYearsDrawIsPublished, thisYear } =
    await fetchDraw();

  const date = new Date();
  const now = date.getTime();

  const state: State = (() => {
    if (now < showDrawFrom && !thisYearsDrawIsPublished) return "placeholder";
    if (now < showDrawFrom && thisYearsDrawIsPublished) return "draw";
    if (now < showResultsFrom) return "results";
    return "results";
  })();

  const { paragraph, button } = getStateText(state, new Date(showDrawFrom));

  return (
    <TextPage title={`Regatta draw ${String(thisYear)}`}>
      <p className="lead">
        Each year, the Sudbury Regatta draw is published to{" "}
        <a href={DRAW_URL} target="_blank" rel="noopener noreferrer">
          live.sudburyrowingclub.org.uk
        </a>{" "}
        the week before the regatta.
      </p>
      <p>{paragraph}</p>
      <p className="flex justify-center py-4">
        <Button shadow size="lg" asChild>
          <a href={DRAW_URL} target="_blank" rel="noopener noreferrer">
            {button}
          </a>
        </Button>
      </p>
    </TextPage>
  );
};

export default Draw;
