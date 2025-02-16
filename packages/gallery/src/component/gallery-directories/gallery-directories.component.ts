import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GalleryConfig } from "../../config/gallery.config";
import { GalleryService } from "../../service/gallery.service";

@Component({
    selector: 'gallery-directories',
    templateUrl: './gallery-directories.component.html',
    styleUrls: ['./gallery-directories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GalleryDirectoriesComponent implements OnInit {
    @Input() config!: GalleryConfig;
    objectKeys = Object.keys;

    constructor(public gallery: GalleryService, private router: Router) { }

    ngOnInit(): void {
        console.log('GalleryDirectoriesComponent');
        // Additional initialization logic if needed
    }

    getImage(directoryId: string) {
        const state = this.gallery.state.getValue();
        const imageId = state.directoryImages[directoryId][0];
        return state.images.find((i) => i.id === imageId)!;
    }

    getImageCount(directoryId: string) {
        const state = this.gallery.state.getValue();
        return state.directoryImages[directoryId].length;
    }

    selectDirectory(directoryId: string) {
        this.router.navigate([`/${directoryId}`]);
        document.querySelector('gallery :first-child')!.scrollTo(0, 0);
    }
}
