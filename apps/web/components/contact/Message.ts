import { z } from "zod";

export const DEFAULT_VALUE = "default";

const MessageToSchema = z.string().refine((value) => value !== DEFAULT_VALUE, {
  message: "Select a recipient",
});
const MessageNameSchema = z.string().trim().min(1, "Provide your name");
const MessageEmailSchema = z
  .string()
  .trim()
  .pipe(z.email("Provide your email"));
const MessageMessageSchema = z.string().trim().min(1, "Provide a message");
const MessageTokenSchema = z
  .string()
  .trim()
  .min(1, "Unable to verify you are human");

export const MessageSchema = z.object({
  email: MessageEmailSchema,
  message: MessageMessageSchema,
  name: MessageNameSchema,
  to: MessageToSchema,
  token: MessageTokenSchema,
});

export type Message = z.infer<typeof MessageSchema>;
