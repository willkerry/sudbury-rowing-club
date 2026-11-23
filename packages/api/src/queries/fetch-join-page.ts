import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { NESTED_IMAGE_FIELDS, Z_IMAGE_SCHEMA } from "../shared/image";
import { ZTypedObject } from "./typed-object";

const ZJoinPageSchema = z.object({
  sections: z.array(
    z.object({
      _key: z.string(),
      content: z.array(ZTypedObject),
      image: Z_IMAGE_SCHEMA.nullable(),
      subtitle: z.string().nullable(),
      title: z.string(),
    }),
  ),
  stages: z.array(
    z.object({
      _key: z.string(),
      content: z.string(),
      name: z.string(),
    }),
  ),
});

const query = groq`*[_id == "joinPage"][0] {
  "sections": sections[] {
    _key,
    content,
    image { ${NESTED_IMAGE_FIELDS} },
    subtitle,
    title,
  },
  "stages": stages[] { _key, content, name },
}`;

export type JoinPage = z.infer<typeof ZJoinPageSchema>;

export const fetchJoinPage = async () => {
  const data = await sanityClient.fetch(query);

  return ZJoinPageSchema.parse(data);
};
