import { Parcel } from "@parcel/core";
import { remove } from "fs-extra/esm";

import { generateResults, cleanResults, TEMP } from "./convert.ts";

const bundler = new Parcel({
  entries: `${TEMP}/index.html`,
  defaultConfig: "@parcel/config-default",
  mode: "production",
});

const clean = async () =>
  Promise.all([cleanResults(), remove(".parcel-cache")]);

const main = async () => {
  try {
    await clean();

    console.log("Generating results from archival HTML...");
    await generateResults();

    console.log("Bundling results with Parcel...");
    await bundler.run();

    console.log("Done.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await clean();
    process.exit(0);
  }
};

main();
