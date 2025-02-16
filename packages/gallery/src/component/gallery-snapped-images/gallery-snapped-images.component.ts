import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryConfig } from "../../config/gallery.config";
import { GalleryService } from "../../service/gallery.service";
import { GalleryImage, GalleryState } from "../../service/gallery.state";

@Component({
    selector: 'gallery-snapped-images',
    templateUrl: './gallery-snapped-images.component.html',
    styleUrls: ['./gallery-snapped-images.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GallerySnappedImagesComponent implements OnInit {
    @Input() public state!: GalleryState;
    @Input() public config!: GalleryConfig;

    snappedImages: GalleryImage[];

    constructor(public gallery: GalleryService, private location: Location, private router: Router) {
        this.snappedImages = Object.values(this.gallery.state.getValue().images).filter((img) => img.snapped);
    }

    ngOnInit() {
        // Additional initialization logic if needed
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
