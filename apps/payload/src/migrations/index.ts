import * as migration_20260608_191845 from "./20260608_191845";
import * as migration_20260609_173017 from "./20260609_173017";
import * as migration_20260609_182458 from "./20260609_182458";
import * as migration_20260609_204000 from "./20260609_204000";

export const migrations = [
  {
    down: migration_20260608_191845.down,
    name: "20260608_191845",
    up: migration_20260608_191845.up,
  },
  {
    down: migration_20260609_173017.down,
    name: "20260609_173017",
    up: migration_20260609_173017.up,
  },
  {
    down: migration_20260609_182458.down,
    name: "20260609_182458",
    up: migration_20260609_182458.up,
  },
  {
    down: migration_20260609_204000.down,
    name: "20260609_204000",
    up: migration_20260609_204000.up,
  },
];
