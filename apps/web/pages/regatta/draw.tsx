import { InferGetStaticPropsType } from "next";
import TextPage from "@/components/layouts/text-page";
import Button from "@/components/stour/button";
import DateFormatter from "@/components/utils/date-formatter";

const DRAW_URL = "https://live.sudburyrowingclub.org.uk/";

export const getStaticProps = async () => {
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
  ).setDate(firstSaturdayInAugust.getDate() - 4);

  const tenAMOnFirstSaturdayInAugustInBST = new Date(
    firstSaturdayInAugust,
  ).setHours(10);

  const draw = await (async () => {
    const drawResponse = await fetch(DRAW_URL);
    return drawResponse.text();
  })();

  const thisYearsDrawIsPublished = (() => {
    const drawYear = draw.match(/20\d\d/)?.[0];
    return drawYear === thisYear.toString();
  })();

  return {
    props: {
      showDrawFrom: mondayBeforeFirstSaturdayInAugust,
      showResultsFrom: tenAMOnFirstSaturdayInAugustInBST,
      thisYearsDrawIsPublished: await thisYearsDrawIsPublished,
      thisYear,
    },
    revalidate: 60 * 60 * 24,
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

const Draw = ({
  showDrawFrom,
  showResultsFrom,
  thisYearsDrawIsPublished,
  thisYear,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const date = new Date();
  const now = date.getTime();

  const state: State = (() => {
    if (now < showDrawFrom && !thisYearsDrawIsPublished) return "placeholder";
    if (now < showDrawFrom && thisYearsDrawIsPublished) return "draw";
    if (now < showResultsFrom) return "results";
    return "results";
  })();

  const { paragraph, button } = getStateText(state, date);

  return (
    <TextPage
      title={`Regatta draw ${String(thisYear)}`}
      description="Draw for the Sudbury Regatta"
    >
      <p className="lead">
        Each year, the Sudbury Regatta draw is published to{" "}
        <a href={DRAW_URL} target="_blank" rel="noopener noreferrer">
          live.sudburyrowingclub.org.uk
        </a>{" "}
        the week before the regatta.
      </p>
      <p>{paragraph}</p>
      <p className="flex justify-center py-4">
        <Button href={DRAW_URL} shadow size="large">
          {button}
        </Button>
      </p>
    </TextPage>
  );
};

export default Draw;
