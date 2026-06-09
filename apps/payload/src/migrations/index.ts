import * as migration_20260608_191845 from './20260608_191845';
import * as migration_20260609_173017 from './20260609_173017';
import * as migration_20260609_182458 from './20260609_182458';
import * as migration_20260609_204726 from './20260609_204726';
import * as migration_20260609_211358 from './20260609_211358';
import * as migration_20260609_215452 from './20260609_215452';
import * as migration_20260609_220854 from './20260609_220854';
import * as migration_20260609_223221 from './20260609_223221';
import * as migration_20260609_224656 from './20260609_224656';

export const migrations = [
  {
    up: migration_20260608_191845.up,
    down: migration_20260608_191845.down,
    name: '20260608_191845',
  },
  {
    up: migration_20260609_173017.up,
    down: migration_20260609_173017.down,
    name: '20260609_173017',
  },
  {
    up: migration_20260609_182458.up,
    down: migration_20260609_182458.down,
    name: '20260609_182458',
  },
  {
    up: migration_20260609_204726.up,
    down: migration_20260609_204726.down,
    name: '20260609_204726',
  },
  {
    up: migration_20260609_211358.up,
    down: migration_20260609_211358.down,
    name: '20260609_211358',
  },
  {
    up: migration_20260609_215452.up,
    down: migration_20260609_215452.down,
    name: '20260609_215452',
  },
  {
    up: migration_20260609_220854.up,
    down: migration_20260609_220854.down,
    name: '20260609_220854',
  },
  {
    up: migration_20260609_223221.up,
    down: migration_20260609_223221.down,
    name: '20260609_223221',
  },
  {
    up: migration_20260609_224656.up,
    down: migration_20260609_224656.down,
    name: '20260609_224656'
  },
];
