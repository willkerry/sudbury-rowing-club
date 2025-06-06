import { kyInstance } from "@/app/get-query-client";
import { WarningSourceEnum } from "@/components/safety/quoted-warning";
import type { SafetyComponentProps } from "@/components/safety/safety-component";
import { EAStationResponseSchema } from "@/types/ea-station-respose";
import { EAWarningSchema } from "@/types/ea-warning";
import { type Severity, severities } from "@/types/severity";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { z } from "zod";
import { CLUB_LOCATION } from "./constants";

const SanityStatusSchema = z.object({
  _updatedAt: z.coerce.date(),
  description: z.string(),
  display: z.boolean(),
  status: z.enum(severities),
});

/** Fetches the latest safety status from the content management system */
const fetchSanityStatus = () =>
  sanityClient
    .fetch(
      groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
        _updatedAt,
        description,
        display,
        status
      }`,
    )
    .then(SanityStatusSchema.parse);

const EA_WARNING_URL = `https://environment.data.gov.uk/flood-monitoring/id/floods?${new URLSearchParams(
  {
    lat: String(CLUB_LOCATION[0]),
    long: String(CLUB_LOCATION[1]),
    dist: String(3),
  },
).toString()}`;

/** Fetches the latest flood warning from the Environment Agency API, using the
 * club's location */
const fetchEAWarning = () =>
  kyInstance
    .get(EA_WARNING_URL)
    .json()
    .then(z.object({ items: z.array(EAWarningSchema) }).parse)
    .then((res) => res.items[0]);

/** Fetches monitoring station data from the Environment Agency API */
const fetchEAStation = () =>
  kyInstance
    .get("https://environment.data.gov.uk/flood-monitoring/id/stations/E21856")
    .json()
    .then(z.object({ items: EAStationResponseSchema }).parse)
    .then((res) => res.items);

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
const getSafetyStatus = async (): Promise<SafetyComponentProps> => {
  const [sanityStatus, eaWarning, station] = await Promise.all([
    fetchSanityStatus(),
    fetchEAWarning(),
    fetchEAStation(),
  ]);

  if (sanityStatus.display) {
    return {
      status: sanityStatus.status,
      description: sanityStatus.description,
      date: sanityStatus._updatedAt,
      statusMessage: sanityStatus.status.toString(),
    };
  }

  if (eaWarning) {
    const { severity, severityLevel, message, timeRaised } = eaWarning;
    return {
      status: numericSeverityMap[severityLevel],
      description: message || "",
      date: timeRaised,
      statusMessage: severity,
      source: WarningSourceEnum.environmentAgency,
    };
  }

  if (station) {
    const { value } = station.measures.latestReading;
    const { typicalRangeHigh, typicalRangeLow } = station.stageScale;
    const mean = (typicalRangeHigh + typicalRangeLow) / 2;

    const status = value >= mean ? "amber" : "neutral";

    return {
      status,
      description: formatDescriptionString(
        station.label,
        value,
        typicalRangeHigh,
        typicalRangeLow,
      ),
      date: station.measures.latestReading.dateTime,
      statusMessage: "Monitoring station",
    };
  }

  return {
    status: "neutral",
    description: "No data available",
    date: new Date(),
    statusMessage: "No data available",
  };
};

export default getSafetyStatus;
