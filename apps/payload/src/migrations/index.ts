import * as migration_20260608_191845 from "./20260608_191845";

export const migrations = [
  {
    down: migration_20260608_191845.down,
    name: "20260608_191845",
    up: migration_20260608_191845.up,
  },
];
