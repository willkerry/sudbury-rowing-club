import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type CloudflareContext,
  getCloudflareContext,
} from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import { buildConfig } from "payload";
import type { GetPlatformProxyOptions } from "wrangler";
import { GovernanceDocuments } from "./collections/GovernanceDocuments";
import { Media } from "./collections/Media";
import { Officers } from "./collections/Officers";
import { People } from "./collections/People";
import { RegattaDocuments } from "./collections/RegattaDocuments";
import { Regattas } from "./collections/Regattas";
import { SafetyNotices } from "./collections/SafetyNotices";
import { Trustees } from "./collections/Trustees";
import { Users } from "./collections/Users";
import { VicePresidents } from "./collections/VicePresidents";
import { Governance } from "./globals/Governance";
import { Landing } from "./globals/Landing";
import { Regatta } from "./globals/Regatta";
import { SafetyStatus } from "./globals/SafetyStatus";
import { NoteBlock } from "./lib/lexical/note-block";
import { OembedBlock } from "./lib/lexical/oembed-block";
import { QuoteBlock } from "./lib/lexical/quote-block";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const realpath = (value: string) =>
  fs.existsSync(value) ? fs.realpathSync(value) : undefined;

const isCLI = process.argv.some((value) =>
  realpath(value).endsWith(path.join("payload", "bin.js")),
);
const isProduction = process.env.NODE_ENV === "production";

const createLog =
  (level: string, fn: typeof console.log) =>
  (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === "string") {
      fn(JSON.stringify({ level, msg: objOrMsg }));
    } else {
      fn(
        JSON.stringify({
          level,
          ...objOrMsg,
          msg: msg ?? (objOrMsg as { msg?: string }).msg,
        }),
      );
    }
  };

const cloudflareLogger = {
  debug: createLog("debug", console.debug),
  error: createLog("error", console.error),
  fatal: createLog("fatal", console.error),
  info: createLog("info", console.log),
  level: process.env.PAYLOAD_LOG_LEVEL || "info",
  trace: createLog("trace", console.debug),
  warn: createLog("warn", console.warn),
  silent: () => {},
} as any; // Use PayloadLogger type when it's exported

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true });

export default buildConfig({
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    idType: "uuid",
    migrationDir: path.resolve(dirname, "migrations"),
  }),

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({ blocks: [QuoteBlock, NoteBlock, OembedBlock] }),
    ],
  }),
  globals: [Landing, Regatta, Governance, SafetyStatus],
  logger: isProduction ? cloudflareLogger : undefined,
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    People,
    Officers,
    RegattaDocuments,
    Regattas,
    VicePresidents,
    Trustees,
    GovernanceDocuments,
    SafetyNotices,
  ],
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
  typescript: {
    outputFile: path.resolve("../", "web", "types", "payload-types.ts"),
  },
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(
    /* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`
  ).then(({ getPlatformProxy }) =>
    getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: isProduction,
    } satisfies GetPlatformProxyOptions),
  );
}
