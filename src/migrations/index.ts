import * as migration_20250410_151942 from './20250410_151942';
import * as migration_20250411_222542 from './20250411_222542';
import * as migration_20250416_223711 from './20250416_223711';
import * as migration_20250420_002748 from './20250420_002748';
import * as migration_20250524_134529 from './20250524_134529';
import * as migration_20250727_213033 from './20250727_213033';
import * as migration_20251208_211125_packages_bump from './20251208_211125_packages_bump';
import * as migration_20260830_100000_gallery_storage_url from './20260830_100000_gallery_storage_url';

export const migrations = [
  {
    up: migration_20250410_151942.up,
    down: migration_20250410_151942.down,
    name: '20250410_151942',
  },
  {
    up: migration_20250411_222542.up,
    down: migration_20250411_222542.down,
    name: '20250411_222542',
  },
  {
    up: migration_20250416_223711.up,
    down: migration_20250416_223711.down,
    name: '20250416_223711',
  },
  {
    up: migration_20250420_002748.up,
    down: migration_20250420_002748.down,
    name: '20250420_002748',
  },
  {
    up: migration_20250524_134529.up,
    down: migration_20250524_134529.down,
    name: '20250524_134529',
  },
  {
    up: migration_20250727_213033.up,
    down: migration_20250727_213033.down,
    name: '20250727_213033',
  },
  {
    up: migration_20251208_211125_packages_bump.up,
    down: migration_20251208_211125_packages_bump.down,
    name: '20251208_211125_packages_bump'
  },
  {
    up: migration_20260830_100000_gallery_storage_url.up,
    down: migration_20260830_100000_gallery_storage_url.down,
    name: '20260830_100000_gallery_storage_url'
  },
];
