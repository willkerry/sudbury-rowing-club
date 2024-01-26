import groq from "groq";
import { z } from "zod";
import { ZTypedObject } from "@sudburyrc/api";
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
    }),
    {},
    { staleTime: 5 * 60 * 1000 },
  );

export default useNotice;
