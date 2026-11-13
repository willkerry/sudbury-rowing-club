import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import ky, { HTTPError } from "ky";
import { sift } from "radashi";
import { z } from "zod";
import { WarningSourceEnum } from "@/components/safety/quoted-warning";
import type { SafetyComponentProps } from "@/components/safety/safety-component";
import { EAWarningSchema } from "@/types/ea-warning";
import { type Severity, severities } from "@/types/severity";
import { CLUB_LOCATION } from "./constants";
import { err, ok, type Result } from "./result";
import {
  describeFlow,
  type RiverFlow,
  type RiverLevel,
  type RiverReadings,
} from "./river-level";
import { fetchWeatherWarning } from "./server/fetchWeatherWarning";
import { trackServerException } from "./server/track";

const SanityStatusSchema = z.object({
  _updatedAt: z.coerce.date(),
  description: z.string(),
  display: z.boolean(),
  status: z.enum(severities),
});

/** Fetches the latest safety status from the content management system */
const fetchSanityStatus = async (): Promise<
  Result<z.infer<typeof SanityStatusSchema>>
> => {
  try {
    return ok(
      SanityStatusSchema.parse(
        await sanityClient.fetch(
          groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
            _updatedAt,
            description,
            display,
            status
          }`,
        ),
      ),
    );
  } catch (error) {
    trackServerException(error);

    return err(
      error instanceof Error
        ? error.message
        : "Failed to fetch safety status from content management system",
    );
  }
};

const CENTIMETRES_PER_METRE = 100;
const MS_PER_HOUR = 3_600_000;

const getEaWarningUrl = (): string =>
  `https://environment.data.gov.uk/flood-monitoring/id/floods?${new URLSearchParams(
    {
      dist: String(3),
      lat: String(CLUB_LOCATION[0]),
      long: String(CLUB_LOCATION[1]),
    },
  ).toString()}`;

/** Fetches the latest flood warning from the Environment Agency API, using the
 * club's location */
const fetchEAWarning = async (): Promise<
  Result<z.infer<typeof EAWarningSchema>>
> => {
  try {
    return ok(
      z
        .object({ items: z.array(EAWarningSchema) })
        .parse(await ky.get(getEaWarningUrl(), { timeout: 5000 }).json())
        .items[0],
    );
  } catch (error) {
    trackServerException(error);

    return err(
      error instanceof HTTPError ? error.message : "Failed to fetch EA warning",
    );
  }
};

const EA_API = "https://environment.data.gov.uk";
const LAMARSH_FLOW_URL = `${EA_API}/hydrology/id/measures/4e87c615-767d-4b34-94c1-ca47926f6a70-flow-m-86400-m3s-qualified/readings?latest`;
// 25 fifteen-minute readings span the last six hours.
const LAMARSH_LEVEL_URL = `${EA_API}/flood-monitoring/id/measures/E21227-level-stage-i-15_min-mASD/readings?_sorted&_limit=25`;

const FlowResponseSchema = z.object({
  items: z.array(z.object({ date: z.string(), value: z.number() })).nonempty(),
});

const LevelResponseSchema = z.object({
  items: z
    .array(z.object({ dateTime: z.coerce.date(), value: z.number() }))
    .nonempty(),
});

const fetchEA = async <T extends z.ZodType>(
  url: string,
  schema: T,
  label: string,
): Promise<Result<z.infer<T>>> => {
  try {
    return ok(schema.parse(await ky.get(url, { timeout: 5000 }).json()));
  } catch (error) {
    trackServerException(error);

    return err(
      error instanceof HTTPError ? error.message : `Failed to fetch ${label}`,
    );
  }
};

/** Daily average flow at Lamarsh, published the following day. */
const fetchLamarshFlow = async (): Promise<Result<RiverFlow>> => {
  const result = await fetchEA(
    LAMARSH_FLOW_URL,
    FlowResponseSchema,
    "Lamarsh flow",
  );

  return result.ok ? ok(result.data.items[0]) : result;
};

/** The live level at Lamarsh and how far it has moved over the last six hours. */
const fetchLamarshLevel = async (): Promise<Result<RiverLevel>> => {
  const result = await fetchEA(
    LAMARSH_LEVEL_URL,
    LevelResponseSchema,
    "Lamarsh level",
  );
  if (!result.ok) return result;

  const [latest] = result.data.items;
  const oldest = result.data.items.at(-1) ?? latest;

  return ok({
    change: Math.round((latest.value - oldest.value) * CENTIMETRES_PER_METRE),
    hours: Math.round(
      (latest.dateTime.getTime() - oldest.dateTime.getTime()) / MS_PER_HOUR,
    ),
    readAt: latest.dateTime,
  });
};

/** Maps the EA's 1-4 severity levels to our traffic light Severity enum */
const numericSeverityMap: Record<1 | 2 | 3 | 4, Severity> = {
  1: "red",
  2: "red",
  3: "amber",
  4: "neutral",
};

const CLUB_HEADLINES: Record<Severity, string> = {
  amber: "Amber: club warning",
  green: "Green: club update",
  neutral: "Club notice",
  red: "Red: club warning",
};

/**
 * Fetches safety status data from a series of different APIs, stopping as soon
 * as it finds a reason to display a warning.
 */
export const getSafetyStatus = async (): Promise<SafetyComponentProps> => {
  const [
    sanityResult,
    eaWarningResult,
    flowResult,
    levelResult,
    weatherWarningResult,
  ] = await Promise.all([
    fetchSanityStatus(),
    fetchEAWarning(),
    fetchLamarshFlow(),
    fetchLamarshLevel(),
    fetchWeatherWarning(),
  ]);

  const flow = flowResult.ok ? flowResult.data : undefined;
  const level = levelResult.ok ? levelResult.data : undefined;
  const river: RiverReadings | undefined =
    flow || level ? { flow, level, station: "Lamarsh" } : undefined;
  const retrievedAt = new Date();

  if (sanityResult.ok && sanityResult.data?.display) {
    const { data: sanityStatus } = sanityResult;

    return {
      date: sanityStatus._updatedAt,
      description: sanityStatus.description,
      river,
      kind: "club",
      retrievedAt,
      status: sanityStatus.status,
      statusMessage: CLUB_HEADLINES[sanityStatus.status],
    };
  }

  if (eaWarningResult.ok && eaWarningResult.data) {
    const {
      data: { severity, severityLevel, message, timeRaised },
    } = eaWarningResult;

    return {
      date: timeRaised,
      description: message || "",
      river,
      kind: "flood",
      retrievedAt,
      source: WarningSourceEnum.environmentAgency,
      status: numericSeverityMap[severityLevel],
      statusMessage: severity,
    };
  }

  if (
    weatherWarningResult.ok &&
    weatherWarningResult.data &&
    weatherWarningResult.data.items.length > 0
  ) {
    const { data: weatherWarning } = weatherWarningResult;

    const lowerCaseSnippet =
      weatherWarning.items[0].contentSnippet.toLowerCase();

    const isYellowOrAmber =
      lowerCaseSnippet.includes("yellow") || lowerCaseSnippet.includes("amber");

    return {
      date: new Date(weatherWarning.pubDate),
      description: weatherWarning.items[0].content,
      river,
      kind: "weather",
      retrievedAt,
      source: WarningSourceEnum.metoffice,
      status: isYellowOrAmber ? "amber" : "red",
      statusMessage: "Met Office weather warning",
    };
  }

  if (river) {
    const { headline, status } = flow
      ? describeFlow(flow.value)
      : { headline: "Flow reading unavailable", status: "neutral" as const };

    return {
      description: "",
      kind: "river",
      retrievedAt,
      river,
      status,
      statusMessage: headline,
    };
  }

  return {
    date: new Date(),
    description:
      "We couldn’t reach the river gauges or warning services. Check conditions at the river before you go out.",
    errors: sift([
      sanityResult.error,
      eaWarningResult.error,
      flowResult.error,
      levelResult.error,
    ]),
    kind: "unavailable",
    retrievedAt,
    status: "neutral",
    statusMessage: "Status unavailable",
  };
};
