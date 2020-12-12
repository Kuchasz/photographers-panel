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
import { warn } from 'console';

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

    constructor(public gallery: GalleryService, private el: ElementRef, private route: ActivatedRoute) { }

    ngOnInit() {
        this.currentDirectoryId = this.route.parent.paramMap.pipe(map((x) => x.get("id")));

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => ({ images: x.images, currId: x.currId, prevId: x.prevId, nextId: x.nextId })),
            map(x => [x.images.find(xx => xx.id === x.prevId), x.images.find(xx => xx.id === x.currId), x.images.find(xx => xx.id === x.nextId)])
        );

        // if (this.config.gestures) {
        const el = this.el.nativeElement;
        const elToMove = this.el.nativeElement.querySelector(".g-image-container");

        // console.log(el);

        const mc = new Hammer.Manager(el);
        mc.add(new Hammer.Pan({ enable: true, threshold: 10, pointers: 1 }));
        mc.add(new Hammer.Pinch({ enable: true }));

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

        const clamp = (min, max) => (numb) => Math.min(Math.max(numb, min), max);

        let screenWidth = 0;
        let screenHeight = 0;
        let prevScale = 1;
        let prevY = 0;
        let prevX = 0;
        let posX = 0;
        let posY = 0;
        // let centerPoint = { x: 0, y: 0 };
        let pinchProgress = false;
        // let prevPosX = 0;
        // let prevPosY = 0;
        //awdawd
        fromEvent(mc, "panstart").subscribe((e: HammerInput) => {
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
        });

        fromEvent(mc, "pinchstart").subscribe((e: HammerInput) => {
            // mc.get(pan).set({ enable: false });
            // const p1 = e.pointers[0];
            // const p2 = e.pointers[0];

            // const desiredCenterPoint = {
            //     x: (p1.x + p2.x) / 2,
            //     y: (p1.y + p2.y) / 2
            // };

            // centerPoint = desiredCenterPoint;
        });

        // fromEvent(mc, "pan").subscribe((e: HammerInput) => {
        //     const clampX = clamp((screenWidth - screenWidth * prevScale) / 2, (screenWidth * prevScale - screenWidth) / 2);
        //     const clampY = clamp((screenHeight - screenHeight * prevScale) / 2, (screenHeight * prevScale - screenHeight) / 2);
        //     const ratioX = prevScale === 1 ? e.deltaX : clampX(prevX + e.deltaX);
        //     const ratioY = prevScale === 1 ? 0 : clampY(prevY + e.deltaY);

        //     TweenLite.set(elToMove, { translateX: `${ratioX}px`, translateY: `${ratioY}px` });
        // });

        // fromEvent(mc, "pinch").subscribe((e: HammerInput) => {
        //     if (e.scale < 1)
        //         return;
        //     TweenLite.set(elToMove, { scaleX: `${e.scale}`, scaleY: `${e.scale}` });
        // });

        fromEvent(mc, "pan pinch").subscribe((e: HammerInput) => {
            const scale = Math.max(1, prevScale * e.scale);
            const clampX = clamp((screenWidth - screenWidth * scale) / 2, (screenWidth * scale - screenWidth) / 2);
            const clampY = clamp((screenHeight - screenHeight * scale) / 2, (screenHeight * scale - screenHeight) / 2);
            let ratioX = prevScale === 1 ? e.deltaX : clampX(prevX + e.deltaX);
            let ratioY = prevScale === 1 ? 0 : clampY(prevY + e.deltaY);

            TweenLite.to(elToMove, .25, { scaleX: scale, scaleY: scale, translateX: `${ratioX}px`, translateY: `${ratioY}px` });
        });

        fromEvent(mc, "pinchend").subscribe((e: HammerInput) => {
            // alert(JSON.stringify(centerPoint));
            prevScale = Math.max(1, prevScale * e.scale);
            const clampX = clamp((screenWidth - screenWidth * prevScale) / 2, (screenWidth * prevScale - screenWidth) / 2);
            const clampY = clamp((screenHeight - screenHeight * prevScale) / 2, (screenHeight * prevScale - screenHeight) / 2);
            prevX = prevScale === 1 ? prevX : clampX(prevX);
            prevY = prevScale === 1 ? 0 : clampY(prevY);
            // mc.get(pan).set({ enable: true });
        });

        let currentDirectoryId = "";
        this.currentDirectoryId.subscribe((v) => {
            currentDirectoryId = v;
        });

        fromEvent(mc, "panend").subscribe((e: HammerInput) => {
            // alert(JSON.stringify(e.changedPointers));
            // alert();
            // alert(e.eventType);
            if(e.pointers.length > 1) return;
            const clampX = clamp((screenWidth - screenWidth * prevScale) / 2, (screenWidth * prevScale - screenWidth) / 2);
            const clampY = clamp((screenHeight - screenHeight * prevScale) / 2, (screenHeight * prevScale - screenHeight) / 2);
            let ratioX = prevScale === 1 ? prevX + e.deltaX : clampX(prevX + e.deltaX);
            let ratioY = prevScale === 1 ? 0 : clampY(prevY + e.deltaY);
            const requiredDelta = 50;
            // // elToMove.style.transform = `translateX(${ratio}%)`;
            const toVars = prevScale === 1 ?
                e.deltaX > requiredDelta
                    ? { translateX: `${screenWidth}px`, translateY: '0px', onComplete: () => this.gallery.prev(currentDirectoryId) }
                    : e.deltaX < -requiredDelta
                        ? { translateX: `-${screenWidth}px`, translateY: '0px', onComplete: () => this.gallery.next(currentDirectoryId) }
                        : { translateX: "0px" }
                : { translateX: `${ratioX}px`, translateY: `${ratioY}px` };
            // { translateX: e.deltaX > 0 ? "100%" : "-100%" }

            if (toVars.translateX === `${screenWidth}px` || toVars.translateX === `-${screenWidth}px`) {
                TweenLite.to(elToMove, 0.25, { scaleY: 1, scaleX: 1, ease: Expo.easeOut });
                ratioX = 0;
                ratioY = 0;
            }

            prevX = ratioX;
            prevY = ratioY;

            TweenLite.to(elToMove, 0.25, { ...toVars, ease: Expo.easeOut });
            elToMove.style.transform = `translate(${e.deltaX}px, 0px)`;
        });

        this.currentImage$.subscribe(() => {
            prevScale = 1;
            prevX = 0;
            prevY = 0;
            TweenLite.to(elToMove, 0.25, { scaleY: `1`, scaleX: `1`, ease: Expo.easeOut });
            TweenLite.set(elToMove, { translateX: `0px`, translateY: `0px` });
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
