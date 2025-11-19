import Parser, { type Enclosure } from "rss-parser";

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

type WeatherWarningResult =
  | {
      ok: true;
      data: WarningResponse;
      error?: never;
    }
  | {
      ok: false;
      data?: never;
      error: string;
    };

const parser = new Parser();

export const fetchWeatherWarning = async (): Promise<WeatherWarningResult> => {
  try {
    const feed = await parser.parseURL(WEATHER_WARNING_URL);

    return {
      ok: true,
      data: feed as WarningResponse,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch weather warning",
    };
  }
};
