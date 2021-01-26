import { GalleryState } from '../service/gallery.state';
import { GalleryConfig } from './gallery.config';

export const defaultState: GalleryState = {
  directories: {},
  images: [],
  directoryImages: {},
  prevId: undefined,
  currId: undefined,
  nextId: undefined,
  fullscreenEnabled: true,
  orientation: undefined,
  displaySnappedImages: false,
  ratingRequestAvailable: false,
  displayRatingRequestDetails: false,
  displayThumbs: true
};

export const defaultConfig: GalleryConfig = {
  style: {
    background: '#555',
    width: '900px',
    height: '500px'
  },
  animation: 'fade',
  loader: {
    width: '50px',
    height: '50px',
    position: 'center',
    icon: 'puff'
  },
  description: {
    position: 'bottom',
    overlay: false,
    text: true,
    counter: true,
    style: {
      color: 'red'
    }
  },
  player: {
    autoplay: false,
    speed: 3000
  },
  thumbnails: {
    width: 50,
    height: 50,
    position: 'left',
    space: 30
  }
};



