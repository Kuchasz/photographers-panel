import {
    BehaviorSubject,
    from,
    interval as fromInterval,
    Observable,
    pipe,
    Subject
    } from "rxjs";
import { defaultConfig, defaultState } from "../config/gallery.default";
import { Directive, Injectable, Optional } from "@angular/core";
import {
    filter,
    finalize,
    find,
    map,
    switchMap,
    take,
    takeWhile,
    tap
    } from "rxjs/operators";
import { GalleryConfig } from "../config/gallery.config";
import {
    GalleryDirectory,
    GalleryImage,
    GalleryState,
    ScreenOrientation
    } from "./gallery.state";
import { sort } from "@pp/utils/dist/array";

@Injectable()
export class GalleryService {
    public state: BehaviorSubject<GalleryState>;
    config: GalleryConfig = defaultConfig;
    downloadedPhotos: string[] = [];

    constructor(@Optional() config: GalleryConfig) {
        this.state = new BehaviorSubject<GalleryState>(defaultState);
        this.config = { ...defaultConfig, ...config };
    }

    load(
        result: {
            images: GalleryImage[];
            directoryImages: { [id: string]: string[] };
            directories: { [id: string]: GalleryDirectory };
        },
        likes: { imageId: string; likes: number; liked: boolean }[]
    ) {
        const state = this.state.getValue();

        const images = result.images.map((i) => ({
            ...i,
            likes: likes.filter((l) => i.id === l.imageId).map((l) => l.likes)[0] ?? 0,
            liked: likes.filter((l) => i.id === l.imageId).map((l) => l.liked)[0] ?? false,
        }));

        type imagesWithLikes = {
            [id: string]: number;
        };

        const imagesLikes = images.reduce((acc, img) => ({ ...acc, [img.id]: img.likes }), {} as imagesWithLikes);

        const dirImages = Object.entries(result.directoryImages).reduce(
            (acc, [key, imgs]) => ({
                ...acc,
                [key]: sort(imgs, (i) => imagesLikes[i]),
            }),
            {}
        );

        this.state.next({
            ...state,
            directories: result.directories,
            images: sort(images, (x) => x.likes),
            directoryImages: dirImages,
            currId: undefined,
            prevId: undefined,
            nextId: undefined,
            ratingRequestAvailable: true, //this.likedPhotos.length >= 10,
        });
    }

    unlikeImage(imageId: string) {
        const img = this.state.getValue().images.find((x) => x.id === imageId);

        if (img == null) return;

        if (img.liked === false) return;

        img.likes--;
        img.liked = false;
    }

    likeImage(imageId: string) {
        const state = this.state.getValue();
        const img = state.images.find((x) => x.id === imageId);

        if (img == null) return;

        if (img.liked === true) return;

        img.likes++;
        img.liked = true;
    }

    setRatingRequestAvailable(enabled: boolean) {
        const state = this.state.getValue();
        this.state.next({ ...state, ratingRequestAvailable: enabled });
    }

    setDisplayRatingRequestDetails(display: boolean) {
        const state = this.state.getValue();
        this.state.next({ ...state, displayRatingRequestDetails: display });
    }

    setOrientation(orientation: ScreenOrientation) {
        const state = this.state.getValue();
        this.state.next({ ...state, orientation });
    }

    toggleOrientation() {
        const state = this.state.getValue();

        const orientation = state.orientation === 'landscape' ? 'portrait' : 'landscape';

        this.state.next({ ...state, orientation });
    }

    selectDirectory(directoryId: string) {
        const state = this.state.getValue();

        const directories = {
            ...state.directories,
            [directoryId]: { ...state.directories[directoryId], visited: true },
        };

        this.state.next({
            ...state,
            directories,
        });

        this.selectImage(state.directoryImages[directoryId][0], directoryId);
    }

    getDirectory(directoryId: string) {
        return this.state.pipe(map((x) => x.directories[directoryId]));
    }

    toggleFullscreen() {
        const state = this.state.getValue();
        this.state.next({
            ...state,
            fullscreenEnabled: !state.fullscreenEnabled,
        });
    }

    toggleThumbs() {
        const state = this.state.getValue();
        this.state.next({
            ...state,
            displayThumbs: !state.displayThumbs,
        });
    }

    clearCurrentImage() {
        const state = this.state.getValue();

        this.state.next({
            ...state,
            ...{
                prevId: undefined,
                currId: undefined,
                nextId: undefined,
            },
        });
    }

    selectImage(id: string, directoryId: string) {
        const state = this.state.getValue();
        const images = state.directoryImages[directoryId];

        this.state.next({
            ...state,
            ...this._getStateIds(id, images),
        });
    }

    private _getStateIds(id: string, images: string[]) {
        const currIndex = images.indexOf(id);
        const prevIndex = currIndex === 0 ? images.length - 1 : currIndex - 1;
        const nextIndex = currIndex === images.length - 1 ? 0 : currIndex + 1;

        return {
            currId: id,
            prevId: images[prevIndex],
            nextId: images[nextIndex],
        };
    }

    snapImage(id: string) {
        const state = this.state.getValue();

        const newState = {
            ...state,
            images: state.images.map((x) => (x.id !== id ? x : { ...x, snapped: !x.snapped })),
        };

        this.state.next(newState);
    }

    snapImages(images: GalleryImage[]) {}

    displaySnappedImages() {
        const state = this.state.getValue();

        this.state.next({ ...state, displaySnappedImages: true });
    }

    goBackToGallery() {
        const state = this.state.getValue();

        this.state.next({ ...state, displaySnappedImages: false });
    }

    next(directoryId: string) {
        const state = this.state.getValue();
        if (state.nextId) this.selectImage(state.nextId, directoryId);
    }

    download(photoId: string) {
        if (this.downloadedPhotos.includes(photoId)) return;

        this.downloadedPhotos.push(photoId);

        if (this.downloadedPhotos.length === 5) {
            const state = this.state.getValue();
            this.state.next({ ...state, displayRatingRequestDetails: true });
        }
    }

    prev(directoryId: string) {
        const state = this.state.getValue();
        if (state.prevId) this.selectImage(state.prevId, directoryId);
    }
}
