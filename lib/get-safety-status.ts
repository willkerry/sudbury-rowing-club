import { type SafetyComponentProps } from "@/components/safety/safety-component";
import { EAStationResponse } from "@/types/ea-station-respose";
import { EAWarning } from "@/types/ea-warning";
import { Severity } from "@/types/severity";
import groq from "groq";
import { CLUB_LOCATION } from "./constants";
import sanityClient from "./sanity.server";

type SanityStatus = {
  _updatedAt: Date;
  description: string;
  display: boolean;
  status: string;
};

/**
 * Fetches the latest safety status from the content management system
 */
async function fetchSanityStatus(): Promise<SanityStatus> {
  const query = groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{_updatedAt,description,display,status}`;
  const data = await sanityClient.fetch<SanityStatus>(query);
  return data;
}

/**
 * Fetches the latest flood warning from the Environment Agency API, using the club's location
 */
async function fetchEAWarning(): Promise<EAWarning | void> {
  const url = new URL(
    "https://environment.data.gov.uk/flood-monitoring/id/floods"
  );
  url.search = new URLSearchParams({
    lat: String(CLUB_LOCATION[0]),
    long: String(CLUB_LOCATION[1]),
    dist: String(5),
  }).toString();

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items[0];
  } catch (e) {
    console.error(e);
    return;
  }
}

/**
 * Fetches monitoring station data from the Environment Agency API
 */
async function getEAStation(): Promise<EAStationResponse | void> {
  try {
    const res = await fetch(
      "https://environment.data.gov.uk/flood-monitoring/id/stations/E21856"
    );
    const { items } = await res.json();
    return items;
  } catch (e) {
    console.error(e);
    return;
  }
}

/**
 * Maps the EA's 1-4 severity levels to our traffic light Severity enum
 * @param severityLevel
 * @returns Severity
 */
function getEquivalentSeverity(severityLevel: 1 | 2 | 3 | 4): Severity {
  switch (severityLevel) {
    case 1:
      return Severity.red;
    case 2:
      return Severity.red;
    case 3:
      return Severity.amber;
    case 4:
      return Severity.neutral;
  }
}

/**
 * Rounds to 2 decimal places
 */
function round(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * Assembles a string describing the current water level at the club's monitoring station
 */
function formatDescritionString(
  stationName: string,
  level: number,
  ceil: number,
  floor: number
): string {
  const mean = (ceil + floor) / 2;
  const inRange = level > floor && level < ceil;
  const above = level >= mean;
  const l = round(level);
  const c = round(ceil);
  const f = round(floor);
  const m = round(mean);

  return `The water level at the ${stationName} measuring station is ${l} metres. This is 
      ${inRange ? "within" : "outside"} the typical range of
      ${f} to ${c} metres and ${above ? "above" : "below"}
      the mean of ${m} metres.`;
}

const getSafetyStatus: () => Promise<SafetyComponentProps | void> =
  async () => {
    const sanityStatus = await fetchSanityStatus();

    if (sanityStatus.display) {
      return {
        status: sanityStatus.status as Severity,
        description: sanityStatus.description,
        date: sanityStatus._updatedAt,
        statusMessage: sanityStatus.status,
      };
    }

    const eaWarning = await fetchEAWarning();

    if (eaWarning) {
      const { severity, severityLevel, message, timeRaised } = eaWarning;
      return {
        status: getEquivalentSeverity(severityLevel),
        description: message,
        date: timeRaised,
        statusMessage: severity,
      };
    }

    const station = await getEAStation();

    if (station) {
      const { value } = station.measures.latestReading;
      const { typicalRangeHigh, typicalRangeLow } = station.stageScale;
      const mean = (typicalRangeHigh + typicalRangeLow) / 2;

      let status = value >= mean ? Severity.amber : Severity.neutral;

      return {
        status,
        description: formatDescritionString(
          station.label,
          value,
          typicalRangeHigh,
          typicalRangeLow
        ),

        date: station.measures.latestReading.dateTime,
        statusMessage: "No flood warnings in the area",
      };
    }

    return;
  };

export default getSafetyStatus;
