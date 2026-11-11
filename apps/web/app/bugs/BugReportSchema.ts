import { z } from "zod";

const BugReportNameSchema = z.string().min(1, "Provide your name");
const BugReportEmailSchema = z
  .string()
  .trim()
  .pipe(z.email("Provide a valid email address"));
const BugReportDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Provide a description");
const BugReportUserAgentSchema = z.string().min(1, "Provide your user agent");
const BugReportAdditionalInformationSchema = z.string();

export const BugReportSchema = z.object({
  additionalInformation: BugReportAdditionalInformationSchema,
  description: BugReportDescriptionSchema,
  email: BugReportEmailSchema,
  name: BugReportNameSchema,
  userAgent: BugReportUserAgentSchema,
});

export type BugReport = z.infer<typeof BugReportSchema>;
