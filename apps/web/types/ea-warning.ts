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

const SeverityLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

const INTRA_NEWLINE_REGEX = /(\n)(?!\n)/g;
const TRAILING_NEWLINE_REGEX = /\n$/;

export const EAWarningSchema = z
  .object({
    "@id": z.string(),
    description: z.string(),
    eaAreaName: z.string(),
    eaRegionName: z.string(),
    floodArea: FloodAreaSchema,
    floodAreaID: z.string(),
    isTidal: z.boolean(),
    message: z
      .string()
      .transform((value) =>
        value
          // double up single newlines
          .replace(INTRA_NEWLINE_REGEX, "$1$1")
          // then strip trailing newlines
          .replace(TRAILING_NEWLINE_REGEX, ""),
      )
      .optional(),
    severity: z.string(),
    severityLevel: SeverityLevelSchema,
    timeMessageChanged: z.coerce.date(),
    timeRaised: z.coerce.date(),
    timeSeverityChanged: z.coerce.date(),
  })
  .optional();

export type EAWarning = z.infer<typeof EAWarningSchema>;
