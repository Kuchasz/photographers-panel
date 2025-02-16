import { DisplayModes, GalleryConfig } from "./gallery.config";
import { GalleryState } from "../service/gallery.state";
import { checkIfMobile } from "../utils/browser";

export const defaultState: GalleryState = {
    directories: {},
    images: [],
    directoryImages: {},
    prevId: undefined,
    currId: undefined,
    nextId: undefined,
    fullscreenEnabled: true,
    orientation: 'portrait',
    displaySnappedImages: false,
    ratingRequestAvailable: false,
    displayRatingRequestDetails: false,
    displayThumbs: true,
};

export const defaultConfig: GalleryConfig = {
    style: {
        background: 'rgba(0, 0, 0, 0.9)',
        width: '100%',
        height: '100%',
    },
    description: {
        position: 'bottom',
        overlay: false,
        text: true,
        counter: true,
    },
    thumbnails: {
        width: 80,
        height: 80,
        position: 'bottom',
        space: 20,
    },
    navigation: {},
    gestures: checkIfMobile(),
    displayMode: checkIfMobile() ? DisplayModes.Compact : DisplayModes.Full,
}