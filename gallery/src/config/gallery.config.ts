import { GalleryDescConfig } from './gallery-desc.config';
import { GalleryNavConfig } from './gallery-nav.config';
import { GalleryThumbConfig } from './gallery-thumb.config';
import { GalleryPlayConfig } from './gallery-play.config';
import { GalleryLoaderConfig } from './gallery-loader.config';

export enum DisplayModes{
  Full,
  Compact
}

export interface GalleryConfig {
  animation?: string;
  gestures?: boolean;
  style?: any;
  description?: GalleryDescConfig;
  thumbnails?: GalleryThumbConfig;
  loader?: GalleryLoaderConfig;
  navigation?: GalleryNavConfig;
  player?: GalleryPlayConfig;
  displayMode?: DisplayModes;
}
