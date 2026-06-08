import * as migration_20250929_111647 from "./20250929_111647";
import * as migration_20260607_163441 from "./20260607_163441";

export const migrations = [
  {
    down: migration_20250929_111647.down,
    name: "20250929_111647",
    up: migration_20250929_111647.up,
  },
  {
    down: migration_20260607_163441.down,
    name: "20260607_163441",
    up: migration_20260607_163441.up,
  },
];
