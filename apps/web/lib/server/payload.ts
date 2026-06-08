import { PayloadSDK } from "@payloadcms/sdk";
import type { Config } from "@/types/payload-types";

export const sdk = new PayloadSDK<Config>({
  baseURL: "http://localhost:3001/api",
});
