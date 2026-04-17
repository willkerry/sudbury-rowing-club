import { kv } from "@vercel/kv";
import { z } from "zod";

const KEY_PREFIX = "contact:inflight:";
const TTL_SECONDS = 60 * 60 * 72;

export const InflightContactSchema = z.object({
  fromEmail: z.email(),
  fromName: z.string().min(1),
  toName: z.string().min(1),
  toRole: z.string().min(1),
});

export type InflightContact = z.infer<typeof InflightContactSchema>;

const key = (messageId: string) => `${KEY_PREFIX}${messageId}`;

export const storeInflightContact = async (
  messageId: string,
  value: InflightContact,
) => {
  await kv.set(key(messageId), value, { ex: TTL_SECONDS });
};

export const readInflightContact = async (messageId: string) => {
  const value = await kv.get(key(messageId));

  if (!value) return null;

  const parsed = InflightContactSchema.safeParse(value);

  if (!parsed.success) return null;

  return parsed.data;
};

export const deleteInflightContact = async (messageId: string) => {
  await kv.del(key(messageId));
};
