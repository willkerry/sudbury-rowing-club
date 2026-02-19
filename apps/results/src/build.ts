import { performance } from "node:perf_hooks";
import { Parcel } from "@parcel/core";
import { consola } from "consola";
import { remove } from "fs-extra/esm";
import ms from "ms";

import { cleanResults, generateResults, TEMP } from "./convert.ts";

const clean = async () =>
  Promise.all([cleanResults(), remove(".parcel-cache")]);

export const build = async () => {
  const start = performance.now();

  const bundler = new Parcel({
    defaultConfig: "@parcel/config-default",
    entries: `${TEMP}/index.html`,
    mode: "production",
  });

  try {
    await clean();
    consola.info(`Cleaned up old results in ${ms(performance.now() - start)}`);

    consola.start("Generating results from archival HTML...");

    await generateResults();
    consola.info(`Generated results in ${ms(performance.now() - start)}`);

    consola.start("Bundling results with Parcel...");

    await bundler.run();
    consola.info(
      `Bundled results with Parcel in ${ms(performance.now() - start)}`,
    );

    const end = performance.now();

    consola.success(`Done in ${ms(end - start)}`);
  } catch (error) {
    consola.error(error);
  } finally {
    await clean();
  }
};

await build();
