import * as events from "@pp/api/event";
import * as screenfull from "screenfull";
import * as user from "@pp/api/user";
import { ApiService } from "../../service/api.service";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
    } from "@angular/core";
import { DisplayModes } from "../../config/gallery.config";
import {
    find,
    first,
    map,
    tap
    } from "rxjs/operators";
import { GalleryConfig } from "../../index";
import { GalleryDirectory, GalleryImage, GalleryState } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { getOrRegisterName } from "@pp/utils/user";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { translations } from "../../i18n";

@Component({
    selector: 'gallery-state',
    templateUrl: './gallery-state.component.html',
    styleUrls: ['./gallery-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryStateComponent {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    @Input() directoryId: string;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);

    // currentDirectoryId$: Observable<string>;
    currentImage$: Observable<GalleryImage>;
    currentImageIndex$: Observable<number>;
    numberOfImages$: Observable<number>;
    // currentDirectoryId$: Observable<string>;
    translations = translations;

    downloadEnabled: boolean;
    fullscreenEnabled: boolean;

    constructor(
        public gallery: GalleryService,
        public api: ApiService,
        private router: Router,
        private location: Location
    ) {
        this.downloadEnabled = window.fetch !== undefined && window.URL !== undefined;
        this.fullscreenEnabled = screenfull ? screenfull.isEnabled : false;
    }

    ngOnInit() {
        // this.currentDirectoryId$ = this.route.parent.paramMap.pipe(map((x) => x.get("id")));
        // this.currentDirectory$ = this.currentDirectoryId$.pipe(
        //     switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        // );

        this.currentImage$ = this.gallery.state.pipe(map((x) => x.images.find((i) => i.id === x.currId)));
        this.currentImageIndex$ = this.gallery.state.pipe(
            map((x) => {
                const directoryId = this.directoryId;

                if (!directoryId) return 0;

                const directoryImages = x.directoryImages[directoryId];
                return directoryImages.indexOf(x.currId) + 1;

                // const currentDir = x.directories
                // x.images.indexOf(x.images.find((i) => i.id === x.currId))
            })
        );
        this.numberOfImages$ = this.gallery.state.pipe(
            map((x) => {
                const directoryId = this.directoryId;

                if (!directoryId) return 0;

                const directoryImages = x.directoryImages[directoryId];
                return directoryImages.length;

                // const currentDir = x.directories
                // x.images.indexOf(x.images.find((i) => i.id === x.currId))
            })
        );
        // this.currentDirectoryId$.subscribe((currentDirectoryId) => (this.currentDirectoryId = currentDirectoryId));
    }

    toggleFullscreen() {
        if (screenfull.isEnabled) {
            if (screenfull.isFullscreen) screenfull.exit();
            else if (screenfull.isEnabled) screenfull.request();
        }
    }

    get snappedCount() {
        return this.state.images.filter((x) => x.snapped).length;
    }

    get ratingRequestAvailable() {
        return this.state.ratingRequestAvailable;
    }

    public displaySnappedImages() {
        this.router.navigate(['/snapped']);
    }

    goBack(event: Event) {
        // this.onBack.emit();
        this.location.back();

        event.stopPropagation();
    }

    orderPhotos() {}

    public download(imgSrc: string, imageId: string, liked: boolean) {
        if (!liked) this.likeImage(imageId);

        fetch(imgSrc)
            .then((resp) => resp.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = imgSrc.split('/').reverse()[0] + '?q=' + Math.random();
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                events.reqisterEvent(
                    events.EventType.PhotoDownloaded,
                    getOrRegisterName(user.getUserName) as user.UserName
                );
                this.gallery.download(imageId);
            })
            .catch(() => console.log(`DOWNLOAD OF: ${imgSrc} failed.`));
    }

    // public snapImage() {
    //     this.gallery.snapImage(this.currentImageId);
    // }

    public likeImage(imageId: string) {
        this.gallery.likeImage(imageId);
        this.api.sdk.likeImage({ imageId, clientId: this.api.clientId });
        events.reqisterEvent(events.EventType.PhotoLiked, getOrRegisterName(user.getUserName) as user.UserName);
    }

    public unlikeImage(imageId: string) {
        // this.gallery.unlikeImage(imageId);
        // this.api.sdk.unlikeImage({ imageId, clientId: this.api.clientId });
        // events.reqisterEvent(events.EventType.PhotoUnliked, getOrRegisterName(user.getUserName) as user.UserName);
    }

    public openDisplayRatingRequestDetails() {
        this.gallery.setDisplayRatingRequestDetails(true);
        events.reqisterEvent(
            events.EventType.DisplayRatingRequestScreen,
            getOrRegisterName(user.getUserName) as user.UserName
        );
    }
}
