import {
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy
    } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { Router } from "@angular/router";

@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnDestroy {
    currentUrl: string = '';
    constructor(public gallery: GalleryService, zone: NgZone, public router: Router) {
        const screenPortraitQuery = window.matchMedia('(orientation: portrait)');

        this.gallery.setOrientation(screenPortraitQuery.matches ? 'portrait' : 'landscape');

        this.router.events.subscribe((e: any) => {
            const url = e.url || '';
            this.currentUrl = url.includes('fullscreen') ? 'hidden' : 'scroll';
        });

        screenPortraitQuery.addListener((e) => {
            zone.run(() => this.gallery.toggleOrientation());
        });
    }

    ngOnDestroy() {
        // this.gallery.reset();
    }
}
