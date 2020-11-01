import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, Renderer2 } from "@angular/core";
import { GalleryState, GalleryImage, GalleryDirectory } from "../../service/gallery.state";
import { GalleryConfig } from "../../config";
import { GalleryService } from "../../service/gallery.service";
import { animation } from "./gallery-image.animation";
import * as Hammer from "hammerjs";
import { TweenLite, Expo } from "gsap";
import { ActivatedRoute } from "@angular/router";
import { Observable, fromEvent } from "rxjs";
import { switchMap, flatMap, tap, map, first } from "rxjs/operators";

@Component({
    selector: "gallery-image",
    templateUrl: "./gallery-image.component.html",
    styleUrls: ["./gallery-image.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: animation
})
export class GalleryImageComponent implements OnInit {
    @Input() state: GalleryState;
    @Input() config: GalleryConfig;
    loading: boolean = true;
    animate: string;

    currentDirectoryId: Observable<string>;
    currentImage$: Observable<[GalleryImage, GalleryImage, GalleryImage]>;
    currentDirectory: Observable<GalleryDirectory>;

    constructor(public gallery: GalleryService, private el: ElementRef, private route: ActivatedRoute) {}

    ngOnInit() {
        this.currentDirectoryId = this.route.parent.paramMap.pipe(map((x) => x.get("id")));

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) =>({ images: x.images, currId: x.currId, prevId: x.prevId, nextId: x.nextId})),
            map(x => [x.images.find(xx => xx.id === x.prevId), x.images.find(xx => xx.id === x.currId), x.images.find(xx => xx.id === x.nextId)])
        );

        // if (this.config.gestures) {
        const el = this.el.nativeElement;
        const elToMove = this.el.nativeElement.querySelector(".g-image-container");

        // console.log(el);

        const mc = new Hammer(el);

        // TweenLite.set(this.elContainer, { x: -this.config.width / 2 });

        // hammer.on("panend", (e) => {
        //     if (Math.abs(e.velocityX) < 0.5) {
        //         this.thumbsDelta += e.deltaX;
        //         return;
        //     }

        //     const targetDelta = e.deltaX * Math.abs(e.velocityX);

        //     this.thumbsDelta += targetDelta;

        //     this.thumbsDelta = this._valBetween(
        //         this.thumbsDelta,
        //         this.getMaxDelta(), // + this.config.width / 2,
        //         -this.config.width / 2
        //     );

        // TweenLite.to(el, 1, { translateX: '100%' });
        // });

        // el.
        // console.log(el);

        // mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        // mc.on("panmove", function(ev) {
        //     console.log(ev.type +" gesture detected.");
        // });

        let screenWidth = 0;

        fromEvent(mc, "panstart").subscribe((e: any) => {
            screenWidth = window.innerWidth;
        });

        fromEvent(mc, "panleft press panright").subscribe((e: any) => {
            const ratio = (e.deltaX / screenWidth) * 100;
            console.log(ratio, e);

            TweenLite.set(elToMove, { translateX: `${ratio}%` });
        });

        let currentDirectoryId = "";

        this.currentDirectoryId.subscribe((v) => {
            console.log('DIRECTORY_ID:', v);
            currentDirectoryId = v;
        });

        fromEvent(mc, "panend").subscribe((e: any) => {
            console.log('panend', e);
            const ratio = (e.deltaX / screenWidth) * 100;
            // elToMove.style.transform = `translateX(${ratio}%)`;
            const toVars =
                e.deltaX > 50
                    ? { translateX: "100%", onComplete: () => this.gallery.prev(currentDirectoryId) }
                    : e.deltaX < -50
                    ? { translateX: "-100%", onComplete: () => this.gallery.next(currentDirectoryId) }
                    : { translateX: "0%" };
            // { translateX: e.deltaX > 0 ? "100%" : "-100%" }
            TweenLite.fromTo(elToMove, 0.25, { translateX: `${ratio}%` }, {...toVars, ease: Expo.easeOut});
            // elToMove.style.transform = `translate(${e.deltaX}px, 0px)`;
        });

        this.currentImage$.subscribe(() => {
            TweenLite.set(elToMove, { translateX: `0%` });
        });

        // fromEvent(mc, "swiperight")
        //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
        //     .subscribe((g) => {
        //         elToMove.style.transform = `translate(100%, 0px)`;
        //         // this.gallery.prev(g.id);
        //     });

        // fromEvent(mc, "swipeleft")
        //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
        //     .subscribe((g) => {
        //         elToMove.style.transform = `translate(-100%, 0px)`;
        //         // this.gallery.next(g.id);
        //     });
        // }
    }

    imageLoad(done: boolean) {
        this.loading = !done;

        // if (!done) {
        //     this.animate = 'none';
        // } else {
        //     switch (this.config.animation) {
        //         case 'fade':
        //             this.animate = 'fade';
        //             break;
        //         default:
        //             this.animate = 'none';
        //     }
        // }
    }
}
