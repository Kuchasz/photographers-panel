import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { GalleryService } from "../../service/gallery.service";
import { GalleryState } from "../../service/gallery.state";
import { GalleryConfig } from "../../index";
import * as screenfull from "screenfull";
import { Router } from "@angular/router";
import { translations } from '../../i18n';

@Component({
    selector: "gallery-snapped-state",
    templateUrl: "./gallery-snapped-state.component.html",
    styleUrls: ["./gallery-snapped-state.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySnappedStateComponent {
    @Input() config: GalleryConfig;
    @Input() snappedCount: number;    
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>(false);
    translations = translations;

    constructor(public gallery: GalleryService, private router: Router) {}

    toggleFullscreen() {
        if (screenfull.isEnabled) {
            if (screenfull.isFullscreen) screenfull.exit();
            else if (screenfull.isEnabled) screenfull.request();
        }
    }

    public goBack() {
        this.onBack.emit();
    }

    get fullscreenEnabled() {
        if (screenfull) {
            return screenfull.isEnabled;
        }
    }
}
