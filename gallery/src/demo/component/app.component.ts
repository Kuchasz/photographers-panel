import { ChangeDetectionStrategy, Component, OnInit, NgZone } from "@angular/core";
import { GalleryService } from "../../index";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { first } from "rxjs/operators";
import { Title } from '@angular/platform-browser';
import { translations } from '../../i18n';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    constructor(public gallery: GalleryService, private router: Router, private ts: Title) {
        //for app start on directory/..../fullscreen
        router.events.pipe(first()).subscribe((e) => {
            if (e instanceof NavigationStart) {
                if (/\/directory\/\w+\/{0}/g.test(e.url)) {
                    this.gallery.selectDirectory(e.url.split("/")[2]);
                }
            }
        });
        router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                if (/\/directory\/\w+\/{0}$/g.test(e.url)) {
                    this.gallery.selectDirectory(e.url.split("/")[2]);
                }
            }

            if (e instanceof NavigationEnd && e.url === "/") {
                document.querySelector("gallery :first-child").scrollTo(0, 0);
            }

        });

        ts.setTitle(translations.title);
    }

    ngOnInit() {
        // const root = "/";
        // fetchGallery(root).then((gallery) => this.gallery.load(gallery));
    }
}
