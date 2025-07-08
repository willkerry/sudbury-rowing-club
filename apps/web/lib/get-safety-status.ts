import { kyInstance } from "@/app/get-query-client";
import { WarningSourceEnum } from "@/components/safety/quoted-warning";
import type { SafetyComponentProps } from "@/components/safety/safety-component";
import { EAStationResponseSchema } from "@/types/ea-station-respose";
import { EAWarningSchema } from "@/types/ea-warning";
import { type Severity, severities } from "@/types/severity";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { HTTPError } from "ky";
import { sift } from "radash";
import { z } from "zod";
import { CLUB_LOCATION } from "./constants";

type SafetyStatusResult<T> =
  | {
      ok: true;
      data: T;
      error?: never;
    }
  | {
      ok: false;
      data?: never;
      error: string;
    };

const SanityStatusSchema = z.object({
  _updatedAt: z.coerce.date(),
  description: z.string(),
  display: z.boolean(),
  status: z.enum(severities),
});

/** Fetches the latest safety status from the content management system */
const fetchSanityStatus = async (): Promise<
  SafetyStatusResult<z.infer<typeof SanityStatusSchema>>
> => {
  try {
    return {
      ok: true,
      data: SanityStatusSchema.parse(
        await sanityClient.fetch(
          groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
            _updatedAt,
            description,
            display,
            status
          }`,
        ),
      ),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch safety status from content management system",
    };
  }
};

const getEaWarningUrl = (): string =>
  `https://environment.data.gov.uk/flood-monitoring/id/floods?${new URLSearchParams(
    {
      lat: String(CLUB_LOCATION[0]),
      long: String(CLUB_LOCATION[1]),
      dist: String(3),
    },
  ).toString()}`;

/** Fetches the latest flood warning from the Environment Agency API, using the
 * club's location */
const fetchEAWarning = async (): Promise<
  SafetyStatusResult<z.infer<typeof EAWarningSchema>>
> => {
  try {
    return {
      ok: true,
      data: z
        .object({ items: z.array(EAWarningSchema) })
        .parse(
          await kyInstance.get(getEaWarningUrl(), { timeout: 5000 }).json(),
        ).items[0],
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof HTTPError
          ? error.message
          : "Failed to fetch EA warning",
    };
  }
};

const STATION_URL =
  "https://environment.data.gov.uk/flood-monitoring/id/stations/E21856";

/** Fetches monitoring station data from the Environment Agency API */
const fetchEAStation = async (): Promise<
  SafetyStatusResult<z.infer<typeof EAStationResponseSchema>>
> => {
  try {
    return {
      ok: true,
      data: z
        .object({ items: EAStationResponseSchema })
        .parse(await kyInstance.get(STATION_URL, { timeout: 5000 }).json())
        .items,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof HTTPError
          ? error.message
          : "Failed to fetch EA station",
    };
  }
};

/** Maps the EA's 1-4 severity levels to our traffic light Severity enum */
const numericSeverityMap: Record<1 | 2 | 3 | 4, Severity> = {
  1: "red",
  2: "red",
  3: "amber",
  4: "neutral",
};

/** Assembles a string describing the current water level at the club's monitoring station */
function formatDescriptionString(
  name: string,
  level: number,
  ceil: number,
  floor: number,
): string {
  const rangeWord = () => {
    if (level < floor) return "below";
    if (level > ceil) return "above";
    return "within";
  };

  const WEIR_WARNING =
    "There is a downstream weir between our piece of river and the monitoring station, so this value is only an indication of true water conditions.";

  const [l, c, f] = [level, ceil, floor].map((v) =>
    Intl.NumberFormat("en-GB", {
      style: "unit",
      unit: "centimeter",
      maximumFractionDigits: 0,
    }).format(Math.max(0, v * 100)),
  );

  return `The water level at the ${name} measuring station is ${l}. This is ${rangeWord()} the typical range of ${f} to ${c}. ${WEIR_WARNING}`;
}

/**
 * Fetches safety status data from a series of different APIs, stopping as soon
 * as it finds a reason to display a warning.
 */
export const getSafetyStatus = async (): Promise<SafetyComponentProps> => {
  const [sanityResult, eaWarningResult, stationResult] = await Promise.all([
    fetchSanityStatus(),
    fetchEAWarning(),
    fetchEAStation(),
  ]);

  if (sanityResult.ok && sanityResult.data?.display) {
    const { data: sanityStatus } = sanityResult;

    return {
      status: sanityStatus.status,
      description: sanityStatus.description,
      date: sanityStatus._updatedAt,
      statusMessage: sanityStatus.status.toString(),
    };
  }

  if (eaWarningResult.ok && eaWarningResult.data) {
    const {
      data: { severity, severityLevel, message, timeRaised },
    } = eaWarningResult;

    return {
      status: numericSeverityMap[severityLevel],
      description: message || "",
      date: timeRaised,
      statusMessage: severity,
      source: WarningSourceEnum.environmentAgency,
    };
  }

  if (stationResult.ok && stationResult.data) {
    const { value } = stationResult.data.measures.latestReading;
    const { typicalRangeHigh, typicalRangeLow } = stationResult.data.stageScale;
    const mean = (typicalRangeHigh + typicalRangeLow) / 2;

    const status = value >= mean ? "amber" : "neutral";

    return {
      status,
      description: formatDescriptionString(
        stationResult.data.label,
        value,
        typicalRangeHigh,
        typicalRangeLow,
      ),
      date: stationResult.data.measures.latestReading.dateTime,
      statusMessage: "Monitoring station",
    };
  }

  return {
    status: "neutral",
    description: "Unable to fetch safety data from any source",
    date: new Date(),
    statusMessage: "No data available",
    errors: sift([
      sanityResult.error,
      eaWarningResult.error,
      stationResult.error,
    ]),
  };
};
