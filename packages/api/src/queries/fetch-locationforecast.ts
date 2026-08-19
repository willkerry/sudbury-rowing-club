import { z } from "zod";

const MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/complete";
const CLUB_LOCATION = [52.033997, 0.727634] as const;
const COORDINATE_PRECISION = 4;
const USER_AGENT =
  "sudburyrowingclub.org.uk webmaster@sudburyrowingclub.org.uk";

const ZPeriod = z.object({
  details: z.object({ precipitation_amount: z.number().optional() }).optional(),
  summary: z.object({ symbol_code: z.string() }).optional(),
});

const ZEntry = z.object({
  data: z.object({
    instant: z.object({
      details: z.object({
        air_temperature: z.number(),
        fog_area_fraction: z.number().optional(),
        wind_from_direction: z.number(),
        wind_speed: z.number(),
      }),
    }),
    next_1_hours: ZPeriod.optional(),
    next_6_hours: ZPeriod.optional(),
  }),
  time: z.coerce.date(),
});

const ZLocationForecast = z.object({
  properties: z.object({ timeseries: z.array(ZEntry) }),
});

export type LocationForecast = z.infer<typeof ZLocationForecast>;
export type LocationForecastEntry = z.infer<typeof ZEntry>;

export type LocationForecastResult =
  | {
      status: "fresh";
      forecast: LocationForecast;
      lastModified: string | null;
      expires: string | null;
    }
  | { status: "not-modified" };

export const fetchLocationForecast = async (
  lastModified?: string | null,
): Promise<LocationForecastResult> => {
  const params = new URLSearchParams({
    lat: CLUB_LOCATION[0].toFixed(COORDINATE_PRECISION),
    lon: CLUB_LOCATION[1].toFixed(COORDINATE_PRECISION),
  });

  const headers: Record<string, string> = { "User-Agent": USER_AGENT };

  if (lastModified) headers["If-Modified-Since"] = lastModified;

  const response = await fetch(`${MET_URL}?${params.toString()}`, { headers });

  if (response.status === 304) return { status: "not-modified" };

  if (!response.ok) {
    throw new Error(`MET Locationforecast responded ${response.status}`);
  }

  return {
    expires: response.headers.get("expires"),
    forecast: ZLocationForecast.parse(await response.json()),
    lastModified: response.headers.get("last-modified"),
    status: "fresh",
  };
};
