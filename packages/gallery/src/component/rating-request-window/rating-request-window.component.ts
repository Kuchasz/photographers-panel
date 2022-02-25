import * as events from "@pp/api/dist/event";
import * as user from "@pp/api/dist/user";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation
    } from "@angular/core";
import { DisplayModes } from "../../config/gallery.config";
import { GalleryDirectory, GalleryImage, GalleryState } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { getOrRegisterName } from "@pp/utils/dist/user";
import { Location } from "@angular/common";
import { translations } from "../../i18n";

@Component({
    selector: 'rating-request-window',
    templateUrl: './rating-request-window.component.html',
    styleUrls: ['./rating-request-window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
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
