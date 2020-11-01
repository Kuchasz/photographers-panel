import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { Location } from "@angular/common";
import { GalleryState, GalleryDirectory, GalleryImage } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { app } from "../../../../../photographers-panel/server/src/config";
import { translations } from '../../i18n';

@Component({
    selector: "rating-request-window",
    templateUrl: "./rating-request-window.component.html",
    styleUrls: ["./rating-request-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RatingRequestWindowComponent implements OnInit {
    
    reviewUrl: string = app.reviewUrl;
    likedPhotos: string[] = [];
    translations = translations; 
    
    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {
        const state = this.gallery.state.getValue(); 
        this.likedPhotos = this.gallery.likedPhotos.slice(0, 10).map(imageId => state.images.find(x => x.id === imageId).src);
    }

    close(){
        this.gallery.setDisplayRatingRequestDetails(false);
    }


}