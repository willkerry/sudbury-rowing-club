import Parser, { type Enclosure } from "rss-parser";
import { err, ok, type Result } from "@/lib/result";

const WEATHER_WARNING_URL =
  "https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/ee";

export type WarningResponse = {
  items: WarningItem[];
  creator: string;
  title: string;
  description: string;
  pubDate: string;
  link: string;
  language: string;
  copyright: string;
};

export type WarningItem = {
  title: string;
  link: string;
  enclosure: Enclosure;
  content: string;
  contentSnippet: string;
  guid: string;
};

const parser = new Parser();

export const fetchWeatherWarning = async (): Promise<
  Result<WarningResponse>
> => {
  try {
    const feed = await parser.parseURL(WEATHER_WARNING_URL);

    return ok(feed as WarningResponse);
  } catch (error) {
    return err(
      error instanceof Error
        ? error.message
        : "Failed to fetch weather warning",
    );
  }
};
