import * as migration_20250410_151942 from './20250410_151942';
import * as migration_20250411_222542 from './20250411_222542';

export const migrations = [
  {
    up: migration_20250410_151942.up,
    down: migration_20250410_151942.down,
    name: '20250410_151942',
  },
  {
    up: migration_20250411_222542.up,
    down: migration_20250411_222542.down,
    name: '20250411_222542'
  },
];
