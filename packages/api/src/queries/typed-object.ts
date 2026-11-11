import type { TypedObject } from "@portabletext/types";
import { z } from "zod";

const schemaForType =
  <T>() =>
  <S extends z.ZodType<T>>(arg: S) =>
    arg;

const baseTypedObjectZ = z.looseObject({
  _key: z.string(),
  _type: z.string(),
});

export const ZTypedObject = schemaForType<TypedObject>()(baseTypedObjectZ);
export type { TypedObject } from "@portabletext/types";
