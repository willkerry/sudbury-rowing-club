import { z } from "zod";

export const DEFAULT_VALUE = "default";

const MessageToSchema = z.string().refine((value) => value !== DEFAULT_VALUE, {
  message: "Select a recipient",
});
const MessageNameSchema = z.string().trim().min(1, "Provide your name");
const MessageEmailSchema = z.email("Provide your email");
const MessageMessageSchema = z.string().trim().min(1, "Provide a message");

export const MessageSchema = z.object({
  to: MessageToSchema,
  name: MessageNameSchema,
  email: MessageEmailSchema,
  message: MessageMessageSchema,
});

export type Message = z.infer<typeof MessageSchema>;
