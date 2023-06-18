import { z } from "zod";

const LowerCornerSchema = z.object({
  lx: z.number(),
  ly: z.number(),
});

const UpperCornerSchema = z.object({
  ux: z.number(),
  uy: z.number(),
});

const EnvelopeSchema = z.object({
  lowerCorner: LowerCornerSchema,
  upperCorner: UpperCornerSchema,
});

const FloodAreaSchema = z.object({
  "@id": z.string(),
  county: z.string(),
  envelope: EnvelopeSchema,
  notation: z.string(),
  polygon: z.string().url(),
  riverOrSea: z.string().optional(),
});

const SeveritySchema = z.union([
  z.literal("Severe Flood Warning"),
  z.literal("Flood Warning"),
  z.literal("Flood Alert"),
  z.literal("Warning no Longer in Force"),
]);

const SeverityLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const EAWarningSchema = z
  .object({
    "@id": z.string(),
    description: z.string(),
    eaAreaName: z.string(),
    eaRegionName: z.string(),
    floodArea: FloodAreaSchema,
    floodAreaID: z.string(),
    isTidal: z.boolean(),
    message: z.string().optional(),
    severity: SeveritySchema,
    severityLevel: SeverityLevelSchema,
    timeMessageChanged: z.string().transform((date) => new Date(date)),
    timeRaised: z.string().transform((date) => new Date(date)),
    timeSeverityChanged: z.string().transform((date) => new Date(date)),
  })
  .optional();

export type EAWarning = z.infer<typeof EAWarningSchema>;
