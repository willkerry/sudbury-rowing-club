import { z } from "zod";
import { inflightStore } from "@/lib/server/inflight-store";

const TTL_SECONDS = 60 * 60 * 72;

export const InflightContactSchema = z.object({
  fromEmail: z.email(),
  fromName: z.string().min(1),
  message: z.string().min(1),
  toName: z.string().min(1),
  toRole: z.string().min(1),
});

export type InflightContact = z.infer<typeof InflightContactSchema>;

export const storeInflightContact = async (
  messageId: string,
  value: InflightContact,
) => {
  await inflightStore.set(messageId, value, { ttlSeconds: TTL_SECONDS });
};

export const readInflightContact = async (messageId: string) => {
  const value = await inflightStore.get(messageId);

  if (!value) return null;

  const parsed = InflightContactSchema.safeParse(value);

  if (!parsed.success) return null;

  return parsed.data;
};

export const claimInflightContact = async (messageId: string) => {
  const deleted = await inflightStore.del(messageId);

  return deleted === 1;
};
