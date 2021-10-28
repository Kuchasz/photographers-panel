import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';
import { GalleryState } from '../../service/gallery.state';

@Component({
    selector: 'gallery-nav',
    templateUrl: './gallery-nav.component.html',
    styleUrls: ['./gallery-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryNavComponent {
    @Input() state: GalleryState;
    @Input() currentDirectoryId: string;

    constructor(public gallery: GalleryService, private location: Location) {}

    goBack() {
        this.location.back();
    }

    prev(e: MouseEvent) {
        this.gallery.prev(this.currentDirectoryId);
        e.stopPropagation();
    }

    next(e: MouseEvent) {
        this.gallery.next(this.currentDirectoryId);
        e.stopPropagation();
    }
}
