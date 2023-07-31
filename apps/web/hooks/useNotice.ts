import groq from "groq";
import { z } from "zod";
import { ZTypedObject } from "@/lib/queries/typed-object";
import useValidatedZodQuery from "./useValidatedZodQuery";

export const noticeVariants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
] as const;

const useNotice = () =>
  useValidatedZodQuery(
    groq`*[_type == "regattaSettings"][0].note`,
    z.object({
      display: z.boolean(),
      label: z.string(),
      text: z.array(ZTypedObject).optional(),
      type: z.enum(noticeVariants),
      link: z.string().optional(),
      date: z
        .string()
        .optional()
        .refine((s) => !s || !Number.isNaN(Date.parse(s))),
    })
  );

export default useNotice;
