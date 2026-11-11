import { performance } from "node:perf_hooks";
import { consola } from "consola";
import ms from "ms";

import { cleanResults, generateResults } from "./convert.ts";
import { optimiseOutput } from "./optimise.ts";

export const build = async () => {
  const start = performance.now();

  try {
    await cleanResults();
    consola.info(`Cleaned up old results in ${ms(performance.now() - start)}`);

    consola.start("Generating results from archival HTML...");

    await generateResults();

    consola.start("Minifying HTML and CSS...");

    const optimised = await optimiseOutput();
    consola.info(`Optimised ${optimised} files`);

    consola.success(`Done in ${ms(performance.now() - start)}`);
  } catch (error) {
    consola.error(error);
  }
};

await build();
