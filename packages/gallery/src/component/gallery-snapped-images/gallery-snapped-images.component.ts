import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { GalleryConfig } from "../../config/gallery.config";
import { GalleryImage, GalleryState } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { Location } from "@angular/common";

@Component({
    selector: 'gallery-snapped-images',
    templateUrl: './gallery-snapped-images.component.html',
    styleUrls: ['./gallery-snapped-images.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GallerySnappedImagesComponent {
    @Input() state!: GalleryState;
    @Input() config!: GalleryConfig;

    snappedImages: GalleryImage[];

    constructor(public gallery: GalleryService, private location: Location) {
        this.snappedImages = Object.values(this.gallery.state.getValue().images).filter((img) => img.snapped);
    }

    remove(i: number) {
        this.snappedImages[i].snapped = false;
    }

    goBack() {
        // this.gallery.snapImage
        this.location.back();
    }

    restore(i: number) {
        this.snappedImages[i].snapped = true;
    }

    getSnappedCount() {
        return this.snappedImages.filter((x) => x.snapped).length;
    }

    getThumbImage(i: number) {
        return `url(${this.snappedImages[i].src})`;
    }
}
