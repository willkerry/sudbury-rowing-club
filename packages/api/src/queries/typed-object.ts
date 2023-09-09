import type { TypedObject } from "@portabletext/types";
import { z } from "zod";

const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) =>
    arg;

const baseTypedObjectZ = z
  .object({
    _type: z.string(),
    _key: z.string(),
  })
  .passthrough();

export const ZTypedObject = schemaForType<TypedObject>()(baseTypedObjectZ);
