import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { Location } from "@angular/common";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap, flatMap, find, first } from "rxjs/operators";
import { ApiService } from '../../service/api.service';
import { translations } from '../../i18n';
import { DisplayModes } from '../../config/gallery.config';

@Component({
    selector: "gallery-state",
    templateUrl: "./gallery-state.component.html",
    styleUrls: ["./gallery-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryStateComponent {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);

    // currentDirectoryId$: Observable<string>;
    currentImage$: Observable<GalleryImage>;
    // currentDirectory$: Observable<GalleryDirectory>;
    translations = translations;

    // currentDirectoryId: string;
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
        this.router.navigate(["/snapped"]);
    }

    goBack() {
        // this.onBack.emit();
        this.location.back();
    }

    orderPhotos() { }

    public download(imgSrc: string) {
        fetch(imgSrc)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = imgSrc.split("/").reverse()[0];
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                // alert('your file has downloaded!'); // or you know, something with better UX...
            })
            .catch(() => console.log(`DOWNLOAD OF: ${imgSrc} failed.`));
    }

    // public snapImage() {
    //     this.gallery.snapImage(this.currentImageId);
    // }

    public likeImage(imageId: string) {//, $event: MouseEvent) {
        this.gallery.likeImage(imageId);
        this.api.sdk.likeImage({ imageId, clientId: this.api.clientId });

        // $event.stopPropagation();
    }

    public unlikeImage(imageId: string) {//, $event: MouseEvent) {
        this.gallery.unlikeImage(imageId);
        this.api.sdk.unlikeImage({ imageId, clientId: this.api.clientId });

        // $event.stopPropagation();
    }

    public openDisplayRatingRequestDetails() {
        this.gallery.setDisplayRatingRequestDetails(true);
    }
}
