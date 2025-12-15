import { Browser } from "happy-dom";
import TextPage from "@/components/layouts/text-page";
import { REGATTA } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { ClientDraw } from "./client";

const WEEK_DAY_OF_REGATTA = 5;
const MONTH_OF_REGATTA = 7;

const WEEK_DAY_OF_DRAW_PUBLICATION = 6;
const HOUR_OF_DRAW_PUBLICATION = 10;

export const revalidate = 86_400;
export const metadata = createMetadata({
  title: `Regatta Draw ${String(new Date().getFullYear())}`,
  description: "Draw for the Sudbury Regatta",
  image: { title: "Regatta Draw" },
});

const getThisYearsDrawIsPublished = async (year: number): Promise<boolean> => {
  const browser = new Browser();
  const page = browser.newPage();

  await page.goto(REGATTA.LIVE_RESULTS_URL);

  const title = page.mainFrame.document.querySelector("title");
  const titleContainsThisYear = Boolean(
    title?.textContent?.includes(year.toString()),
  );

  const pageContainsATable = Boolean(
    page.mainFrame.document.querySelector("table"),
  );

  return titleContainsThisYear && pageContainsATable;
};

const Draw = async () => {
  const thisYearsDrawIsPublished = await getThisYearsDrawIsPublished(
    new Date().getFullYear(),
  );

  return (
    <TextPage title="Regatta draw" lead>
      <ClientDraw
        weekDayOfRegatta={WEEK_DAY_OF_REGATTA}
        monthOfRegatta={MONTH_OF_REGATTA}
        weekDayOfDrawPublication={WEEK_DAY_OF_DRAW_PUBLICATION}
        hourOfDrawPublication={HOUR_OF_DRAW_PUBLICATION}
        thisYearsDrawIsPublished={thisYearsDrawIsPublished}
      />
    </TextPage>
  );
};

export default Draw;
