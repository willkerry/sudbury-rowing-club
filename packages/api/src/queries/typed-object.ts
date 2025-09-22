import type { TypedObject } from "@portabletext/types";
import { z } from "zod";

const schemaForType =
  <T>() =>
  // biome-ignore lint/suspicious/noExplicitAny: https://zod.dev/?id=writing-generic-functions
  <S extends z.ZodType<T, any, any>>(arg: S) =>
    arg;

const baseTypedObjectZ = z
  .object({
    _type: z.string(),
    _key: z.string(),
  })
  .passthrough();

export const ZTypedObject = schemaForType<TypedObject>()(baseTypedObjectZ);
export type { TypedObject } from "@portabletext/types";
