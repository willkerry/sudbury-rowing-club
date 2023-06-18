import { WarningSourceEnum } from "@/components/safety/quoted-warning";
import { type SafetyComponentProps } from "@/components/safety/safety-component";
import { EAStationResponseSchema } from "@/types/ea-station-respose";
import { EAWarningSchema } from "@/types/ea-warning";
import { Severity } from "@/types/severity";
import groq from "groq";
import { z } from "zod";
import { CLUB_LOCATION } from "./constants";
import sanityClient from "./sanity.server";

const SanityStatusSchema = z.object({
  _updatedAt: z.string().transform((date) => new Date(date)),
  description: z.string(),
  display: z.boolean(),
  status: z.nativeEnum(Severity),
});

/** Fetches the latest safety status from the content management system */
const fetchSanityStatus = async () =>
  SanityStatusSchema.parse(
    await sanityClient.fetch(
      groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
        _updatedAt,
        description,
        display,
        status
      }`
    )
  );

/** Fetches the latest flood warning from the Environment Agency API, using the
 * club's location */
async function fetchEAWarning() {
  const url = new URL(
    "https://environment.data.gov.uk/flood-monitoring/id/floods"
  );
  url.search = new URLSearchParams({
    lat: String(CLUB_LOCATION[0]),
    long: String(CLUB_LOCATION[1]),
    dist: String(3),
  }).toString();

  try {
    const res = await fetch(url).then((res) => res.json());

    return EAWarningSchema.parse(res.items[0]);
  } catch (e) {
    console.error(e);
  }

  return undefined;
}

/** Fetches monitoring station data from the Environment Agency API */
async function fetchEAStation() {
  const res = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations/E21856"
  );
  const { items } = await res.json();

  return EAStationResponseSchema.parse(items);
}

/** Maps the EA's 1-4 severity levels to our traffic light Severity enum */
const numericSeverityMap: Record<1 | 2 | 3 | 4, Severity> = {
  1: Severity.red,
  2: Severity.red,
  3: Severity.amber,
  4: Severity.neutral,
};

/** Rounds to 2 decimal places */
const round = (n: number) => (Math.round(n * 100) * 0.01).toFixed(2);

/** Assembles a string describing the current water level at the club's monitoring station */
function formatDescriptionString(
  name: string,
  level: number,
  ceil: number,
  floor: number
): string {
  const rangeWord = () => {
    if (level < floor) return "below";
    if (level > ceil) return "above";
    return "within";
  };

  const [l, c, f] = [level, ceil, floor].map(round);

  return `The water level at the ${name} measuring station is ${l} metres. This is ${rangeWord()} the typical range of ${f} to ${c} metres.`;
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

    const status = value >= mean ? Severity.amber : Severity.neutral;

    return {
      status,
      description: formatDescriptionString(
        station.label,
        value,
        typicalRangeHigh,
        typicalRangeLow
      ),
      date: station.measures.latestReading.dateTime,
      statusMessage: "Monitoring station",
    };
  }

  return {
    status: Severity.neutral,
    description: "No data available",
    date: new Date(),
    statusMessage: "No data available",
  };
};

export default getSafetyStatus;
