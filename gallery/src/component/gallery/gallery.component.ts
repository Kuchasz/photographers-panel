import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  NgZone
} from "@angular/core";
import { GalleryService } from "../../service/gallery.service";

@Component({
  selector: "gallery",
  templateUrl: "./gallery.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnDestroy {
  constructor(public gallery: GalleryService, zone: NgZone) {
    const screenPortraitQuery = window.matchMedia("(orientation: portrait)");

    this.gallery.setOrientation(
      screenPortraitQuery.matches ? "portrait" : "landscape"
    );

    screenPortraitQuery.addListener(e => {
      zone.run(() => this.gallery.toggleOrientation());
    });
  }

  ngOnDestroy() {
    this.gallery.reset();
  }
}