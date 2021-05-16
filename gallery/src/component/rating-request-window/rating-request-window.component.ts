import {
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { GalleryState, GalleryDirectory, GalleryImage } from '../../service/gallery.state';
import { GalleryService } from '../../service/gallery.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { translations } from '../../i18n';
import { DisplayModes } from '../../config/gallery.config';
import * as events from "@pp/api/event";
import { getOrRegisterName } from '@pp/utils/user';
import * as user from '@pp/api/user';

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

    constructor(public gallery: GalleryService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit() {
        const state = this.gallery.state.getValue();

        const photosToDisplay = this.gallery.config.displayMode === DisplayModes.Compact ? 4 : 10;

        this.likedPhotos = this.gallery.likedPhotos
            .slice(0, photosToDisplay)
            .map((imageId) => state.images.find((x) => x.id === imageId).src);
    }

    close() {
        this.gallery.setDisplayRatingRequestDetails(false);
        events.reqisterEvent(events.EventType.CloseRatingRequestScreen, getOrRegisterName(user.getUserName) as user.UserName);
    }

    registerEvent(){
        events.reqisterEvent(events.EventType.NavigatedToRating, getOrRegisterName(user.getUserName) as user.UserName);
    }
}
