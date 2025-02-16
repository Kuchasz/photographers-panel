import { Location } from "@angular/common";
import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output
} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import {
    flatMap,
    map,
    switchMap
} from "rxjs/operators";
import { DisplayModes } from "../../config/gallery.config";
import { GalleryService } from "../../service/gallery.service";
import { GalleryDirectory, GalleryImage } from "../../service/gallery.state";

@Component({
    selector: 'gallery-images-fullscreen',
    templateUrl: './gallery-images-fullscreen.component.html',
    styleUrls: ['./gallery-images-fullscreen.component.scss'],
    standalone: false
})
export class GalleryImagesFullscreenComponent implements OnInit {
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);

    loading: any;
    thumbDirection?: string;

    currentDirectoryId$!: Observable<string>;
    currentDirectory?: Observable<GalleryDirectory>;

    images$?: Observable<GalleryImage[]>;
    isFullView?: boolean;

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit() {
        const thumbPos = this.gallery!.config!.thumbnails!.position;
        this.thumbDirection = thumbPos === 'left' || thumbPos === 'right' ? 'row' : 'column';

        this.currentDirectoryId$ = this.route!.parent!.paramMap.pipe(map((x) => x.get('id')!));

        this.isFullView = this.gallery.config.displayMode !== DisplayModes.Compact;

        this.images$ = this.currentDirectoryId$?.pipe(
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

    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev: KeyboardEvent) {
        if (ev.key !== 'Escape') return;

        this.goBack();
    }

    goBack() {
        this.location.back();
    }
}
