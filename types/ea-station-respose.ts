import * as z from "zod";

const HighestRecentSchema = z.object({
  "@id": z.string(),
  dateTime: z.string().transform((date) => new Date(date)),
  value: z.number(),
});

const StageScaleSchema = z.object({
  "@id": z.string(),
  datum: z.number(),
  highestRecent: HighestRecentSchema,
  maxOnRecord: HighestRecentSchema,
  minOnRecord: HighestRecentSchema,
  scaleMax: z.number(),
  typicalRangeHigh: z.number(),
  typicalRangeLow: z.number(),
});

const LatestReadingSchema = z.object({
  "@id": z.string(),
  date: z.string().transform((date) => new Date(date)),
  dateTime: z.string().transform((date) => new Date(date)),
  measure: z.string(),
  value: z.number(),
});

const MeasuresSchema = z.object({
  "@id": z.string(),
  datumType: z.string(),
  label: z.string(),
  latestReading: LatestReadingSchema,
  notation: z.string(),
  parameter: z.string(),
  parameterName: z.string(),
  period: z.number(),
  qualifier: z.string(),
  station: z.string(),
  stationReference: z.string(),
  type: z.array(z.string()),
  unit: z.string(),
  unitName: z.string(),
  valueType: z.string(),
});

export const EAStationResponseSchema = z.object({
  "@id": z.string(),
  RLOIid: z.string(),
  catchmentName: z.string(),
  dateOpened: z.string().transform((date) => new Date(date)),
  datumOffset: z.number(),
  eaAreaName: z.string(),
  eaRegionName: z.string(),
  easting: z.number(),
  gridReference: z.string(),
  label: z.string(),
  lat: z.number(),
  long: z.number(),
  measures: MeasuresSchema,
  northing: z.number(),
  notation: z.string(),
  riverName: z.string(),
  stageScale: StageScaleSchema,
  stationReference: z.string(),
  status: z.string(),
  town: z.string(),
  type: z.array(z.string()),
  wiskiID: z.string(),
});
export type EAStationResponse = z.infer<typeof EAStationResponseSchema>;
