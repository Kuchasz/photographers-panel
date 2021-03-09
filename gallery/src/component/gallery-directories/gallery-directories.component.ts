import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../config/gallery.config";
import { GalleryService } from "../../service/gallery.service";
import { Router } from "@angular/router";

@Component({
    selector: "gallery-directories",
    templateUrl: "./gallery-directores.component.html",
    styleUrls: ["./gallery-directories.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryDirectoriesComponent {
    @Input() config: GalleryConfig;
    objectKeys = Object.keys;

    constructor(public gallery: GalleryService, private router: Router) {}

    getImage(directoryId: string) {
        const state = this.gallery.state.getValue();
        const imageId = state.directoryImages[directoryId][0];
        return state.images.find((i) => i.id === imageId);
    }

    getImageCount(directoryId: string) {
        const state = this.gallery.state.getValue();
        return state.directoryImages[directoryId].length;
    }

    selectDirectory(directoryId: string) {
        this.router.navigate([`/${directoryId}`]);
        document.querySelector("gallery :first-child").scrollTo(0, 0);
    }
}
