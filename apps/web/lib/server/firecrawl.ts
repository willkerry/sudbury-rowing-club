import { Firecrawl } from "firecrawl";
import { env } from "@/env";

export const firecrawl = new Firecrawl({
  apiKey: env.FIRECRAWL_API_KEY,
});
