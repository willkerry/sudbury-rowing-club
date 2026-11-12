import path from "node:path";

export const APP_DIR = path.resolve(import.meta.dirname, "../..");
export const DATA_DIR = path.join(APP_DIR, "data");
