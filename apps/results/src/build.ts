import { Parcel } from "@parcel/core";
import { consola } from "consola";
import { remove } from "fs-extra/esm";

import { cleanResults, generateResults, TEMP } from "./convert.ts";

const clean = async () =>
  Promise.all([cleanResults(), remove(".parcel-cache")]);

export const build = async () => {
  const bundler = new Parcel({
    entries: `${TEMP}/index.html`,
    defaultConfig: "@parcel/config-default",
    mode: "production",
  });

  try {
    await clean();

    consola.start("Generating results from archival HTML...");

    await generateResults();

    consola.start("Bundling results with Parcel...");

    await bundler.run();

    consola.success("Done.");
  } catch (error) {
    consola.error(error);
  } finally {
    await clean();
  }
};

await build();
