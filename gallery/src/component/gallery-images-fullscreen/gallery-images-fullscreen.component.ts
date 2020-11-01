import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    EventEmitter,
    Output,
    HostListener
} from "@angular/core";
import { Location } from "@angular/common";
import { GalleryState, GalleryDirectory, GalleryImage } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { GalleryConfig } from "../../config";
import { DisplayModes } from "../../config/gallery.config";
import { Observable, fromEvent } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap, find, flatMap, map, tap, first, filter } from "rxjs/operators";

@Component({
    selector: "gallery-images-fullscreen",
    templateUrl: "./gallery-images-fullscreen.component.html",
    styleUrls: ["./gallery-images-fullscreen.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GalleryImagesFullscreenComponent implements OnInit {
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);

    loading: any;
    thumbDirection: string;

    currentDirectoryId$: Observable<string>;
    currentDirectory: Observable<GalleryDirectory>;

    images$: Observable<GalleryImage[]>;

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit() {
        const thumbPos = this.gallery.config.thumbnails.position;
        this.thumbDirection = thumbPos === "left" || thumbPos === "right" ? "row" : "column";

        this.currentDirectoryId$ = this.route.parent.paramMap.pipe(map((x) => x.get("id")));

        this.images$ = this.currentDirectoryId$.pipe(
            flatMap((directoryId) =>
                this.gallery.state.pipe(
                    map((s) => {
                        const ids = s.directoryImages[directoryId];
                        return s.images.filter((i) => ids.includes(i.id));
                    })
                )
            )
        );

        this.currentDirectory = this.currentDirectoryId$.pipe(
            switchMap((directoryIndex) => this.gallery.getDirectory(directoryIndex))
        );
    }

    @HostListener("document:keyup", ["$event"])
    onKeyUp(ev: KeyboardEvent) {
        if (ev.key !== "Escape") return;

        this.goBack();
    }

    get isFullView() {
        return this.gallery.config.displayMode !== DisplayModes.Compact;
    }

    goBack() {
        this.location.back();
    }
}
