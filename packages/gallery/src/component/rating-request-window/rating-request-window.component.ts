import { Location } from "@angular/common";
import {
    Component,
    OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as events from "@pp/api/dist/event";
import * as user from "@pp/api/dist/user";
import { getOrRegisterName } from "@pp/utils/dist/user";
import { DisplayModes } from "../../config/gallery.config";
import { translations } from "../../i18n";
import { GalleryService } from "../../service/gallery.service";

@Component({
    selector: 'rating-request-window',
    templateUrl: './rating-request-window.component.html',
    styleUrls: ['./rating-request-window.component.scss'],
    standalone: false
})
export class RatingRequestWindowComponent implements OnInit {
    reviewUrl: string = 'https://g.page/pyszstudio/review';
    likedPhotos: string[] = [];
    translations = translations;
    requestedWindow: boolean = false;

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit() {
        const state = this.gallery.state.getValue();

        const photosToDisplay = this.gallery.config.displayMode === DisplayModes.Compact ? 4 : 10;

        this.likedPhotos = state.images.slice(0, photosToDisplay).map((s) => s.src);
    }

    close() {
        this.gallery.setDisplayRatingRequestDetails(false);
        events.reqisterEvent(
            events.EventType.CloseRatingRequestScreen,
            getOrRegisterName(user.getUserName) as user.UserName
        );
    }

    registerEvent() {
        this.requestedWindow = true;
        events.reqisterEvent(events.EventType.NavigatedToRating, getOrRegisterName(user.getUserName) as user.UserName);
    }
}
