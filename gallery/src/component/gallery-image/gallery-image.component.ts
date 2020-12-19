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
    currentImage: [GalleryImage, GalleryImage, GalleryImage];

    constructor(public gallery: GalleryService, private el: ElementRef, private route: ActivatedRoute) { }

    ngOnInit() {

        function getRenderedSize(contains, cWidth, cHeight, width, height) {
            var oRatio = width / height,
                cRatio = cWidth / cHeight;
            return function () {
                if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
                    this.width = cWidth;
                    this.height = cWidth / oRatio;
                } else {
                    this.width = cHeight * oRatio;
                    this.height = cHeight;
                }
                this.left = (cWidth - this.width);
                this.right = this.width + this.left;
                return this;
            }.call({});
        }

        this.currentDirectoryId = this.route.parent.paramMap.pipe(map((x) => x.get("id")));

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => ({ images: x.images, currId: x.currId, prevId: x.prevId, nextId: x.nextId })),
            map(x => [x.images.find(xx => xx.id === x.prevId), x.images.find(xx => xx.id === x.currId), x.images.find(xx => xx.id === x.nextId)])
        );

        this.currentImage$.subscribe(ci => this.currentImage = ci);


        // if (this.config.gestures) {
        // const _el = this.el.nativeElement;
        // // const elToMove = this.el.nativeElement.querySelector(".g-image-container");
        const elToMove = this.el.nativeElement.querySelector(".g-image-container");
        const el = this.el.nativeElement;//.querySelector(".curr");
        const image = this.el.nativeElement.querySelector(".curr");


        // // console.log(el);

        const mc = new Hammer.Manager(el);
        mc.add(new Hammer.Pan({ enable: true, pointers: 1 }));
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

        const clamp = (a, b) => (num) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

        // // let screenWidth = 0;
        // // let screenHeight = 0;
        let prevScale = 1;
        let prevY = 0;
        let prevX = 0;
        let canvasSize: { width: number, height: number };
        let imgSize: { width: number, height: number };

        type Position2D = {
            x: number;
            y: number;
        }

        type Viewport = {
            position: Position2D;
            offsetDelta: Position2D;
            zoom: number;
        };

        type ZoomConstrains = {
            min: number;
            max: number;
        }

        const clampX = (numb, zoom) => clamp(-(canvasSize.width * zoom) + canvasSize.width, (canvasSize.width * zoom) - canvasSize.width)(numb);
        const clampY = (numb, zoom) => clamp((-canvasSize.height * zoom + canvasSize.height), (canvasSize.height * zoom - canvasSize.height))(numb);

        const zoomAtPosition = (
            currentViewport: Viewport,
            zoomOffset: number,
            position: Position2D,
            offsetDelta: Position2D,
            returnToHome: boolean
        ): Viewport => {
            const clampZoom = clamp(1, Number.MAX_VALUE);
            const newViewport = ({
                position: {
                    x: position.x - (position.x - currentViewport.position.x) * zoomOffset + offsetDelta.x,
                    y: position.y - (position.y - currentViewport.position.y) * zoomOffset + offsetDelta.y,
                },
                zoom: clampZoom(currentViewport.zoom * zoomOffset),
                offsetDelta: {
                    x: currentViewport.offsetDelta.x + offsetDelta.x,
                    y: currentViewport.offsetDelta.y + offsetDelta.y
                }
            });

            const originalYOffset = (canvasSize.height - imgSize.height) / 2;
            const clampx = clamp(-(imgSize.width * newViewport.zoom) + canvasSize.width, -(canvasSize.width - imgSize.width));
            const clampy = clamp(-originalYOffset * newViewport.zoom, -(canvasSize.height - imgSize.height) / 2 * newViewport.zoom - imgSize.height * newViewport.zoom + canvasSize.height);

            const x = canvasSize.width <= imgSize.width * newViewport.zoom
                ? (newViewport.zoom === 1 && !returnToHome) ? newViewport.position.x : clampx(newViewport.position.x)
                : (canvasSize.width - canvasSize.width * newViewport.zoom) / 2;

            const y = canvasSize.height <= imgSize.height * newViewport.zoom
                ? clampy(newViewport.position.y)
                : (canvasSize.height - canvasSize.height * newViewport.zoom) / 2;

            const dx = (x);
            const dy = (y);

            return { ...newViewport, position: { x: dx, y: dy } };
        };

        // // let posX = 0;
        // // let posY = 0;

        let pinchStart = { x: 0, y: 0 };
        let realPinchStart = { x: 0, y: 0 };

        const zoomConstrains: ZoomConstrains = {
            min: 1,
            max: 10
        }

        const defaultViewport = () => ({
            zoom: 1,
            position: {
                x: 0,
                y: 0,
            },
            offsetDelta: {
                x: 0,
                y: 0,
            }
        });

        let currentViewport: Viewport = defaultViewport();
        // // let pinchProgress = false;


        let currentDirectoryId = "";
        this.currentDirectoryId.subscribe((v) => {
            currentDirectoryId = v;
        });

        // // // let prevPosX = 0;
        // // // let prevPosY = 0;
        // // //awdawd
        // // fromEvent(mc, "panstart").subscribe((e: HammerInput) => {

        // //     // console.log(screenWidth, screenHeight);
        // // });

        fromEvent(mc, "pinchstart panstart").subscribe((e: HammerInput) => {
            // screenWidth = ;//window.innerWidth;
            // screenHeight = ;
            canvasSize = { width: elToMove.clientWidth, height: elToMove.clientHeight };
            // imgSize = { width: image.clientWidth, height: image.clientHeight };
            imgSize = getRenderedSize(true, canvasSize.width, canvasSize.height, this.currentImage[1].width, this.currentImage[1].height);
            pinchStart = {
                x: e.center.x,// * prevScale, 
                y: e.center.y//* prevScale 
            };
            // realPinchStart = {
            //     x: e.center.x * prevScale - prevX,
            //     y: e.center.y * prevScale - prevY
            // };
        });

        // fromEvent(mc, "pan").subscribe((e: HammerInput) => {
        //     const clampX = clamp((screenWidth - screenWidth * prevScale) / 2, (screenWidth * prevScale - screenWidth) / 2);
        //     const clampY = clamp((screenHeight - screenHeight * prevScale) / 2, (screenHeight * prevScale - screenHeight) / 2);
        //     const ratioX = prevScale === 1 ? e.deltaX : clampX(prevX + e.deltaX);
        //     const ratioY = prevScale === 1 ? 0 : clampY(prevY + e.deltaY);

        //     TweenLite.set(elToMove, { translateX: `${ratioX}px`, translateY: `${ratioY}px` });
        // });

        // fromEvent(mc, "pan").subscribe((e: HammerInput) => {
        //     // const scale = Math.max(1, prevScale * e.scale);

        //     // const screenCenter = { x: screenWidth / 2, y: screenHeight / 2 };

        //     // const dx = pinchStart.x * (prevScale - scale);// - pinchStart.x;
        //     // const dy = pinchStart.y * (prevScale - scale);// - pinchStart.y;

        //     // const dx = (pinchStart.x - screenCenter.x) * (prevScale - scale);
        //     // const dy = (pinchStart.y - screenCenter.y) * (prevScale - scale);

        //     // const offsetX = -((screenWidth * scale) - screenWidth) / 2 + dx;
        //     // const offsetY = -((screenHeight * scale) - screenHeight) / 2 + dy;

        //     const offsetX = e.deltaX;
        //     const offsetY = e.deltaY;

        //     const ratioX = prevScale === 1 ? offsetX : clampX(prevX + offsetX, prevScale);
        //     const ratioY = prevScale === 1 ? 0 : clampY(prevY + offsetY, prevScale);

        //     // const ratioX = scale === 1 ? offsetX : clampX(prevX + offsetX, scale);
        //     // const ratioY = scale === 1 ? 0 : clampY(prevY + offsetY, scale);

        //     // const clampX = clamp((screenWidth - screenWidth * scale) / 2, (screenWidth * scale - screenWidth) / 2);
        //     // const clampY = clamp((screenHeight - screenHeight * scale) / 2, (screenHeight * scale - screenHeight) / 2);
        //     // let ratioX = prevScale === 1 ? e.deltaX : clampX(prevX + e.deltaX - screenWidth/2);
        //     // let ratioY = prevScale === 1 ? 0 : clampY(prevY + e.deltaY - screenHeight/2);

        //     // TweenLite.to(elToMove, .25, { scaleX: scale, scaleY: scale, translateX: `${ratioX}px`, translateY: `${ratioY}px` });
        //     TweenLite.set(elToMove, { scaleX: prevScale, scaleY: prevScale, translateX: `${ratioX}px`, translateY: `${ratioY}px` });
        //     // TweenLite.set(elToMove, { scaleX: scale, scaleY: scale });
        // });

        fromEvent(mc, "pinch pan").subscribe((e: HammerInput) => {
            if (e.type === "pan" && (e as any).maxPointers > 1)
                return;

            const offsetDelta = {
                x: e.deltaX,
                y: e.deltaY
            };

            const newViewport = e.type === "pan"
                ? zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, false)
                : zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, true);

            // console.log({ width: canvasSize.width - newViewport.zoom, height: canvasSize.height * newViewport.zoom });
            // console.log({ width: imgSize.width * newViewport.zoom, height: imgSize.height * newViewport.zoom });

            // const clampx = clamp(-(canvasSize.width - imgSize.width) / 2 * newViewport.zoom, (canvasSize.width - imgSize.width) / 2 * newViewport.zoom);
            // const clampy = clamp(-(canvasSize.height - imgSize.height) / 2 * newViewport.zoom, (canvasSize.height - imgSize.height) / 2 * newViewport.zoom);

            // const dx = newViewport.position.x;
            // const dy = newViewport.position.y;

            // elToMove.style.transform = `
            // translate(${dx}px, ${dy}px) 
            // scale(${newViewport.zoom})`;

            TweenLite.to(elToMove, .25, {
                translateX: `${newViewport.position.x}px`,
                translateY: `${newViewport.position.y}px`,
                scale: newViewport.zoom,
                ease: Expo.easeOut
            });

            // TweenLite.to(elToMove, .25, { scaleX: scale, scaleY: scale, translateX: `${ratioX}px`, translateY: `${ratioY}px` });
            // TweenLite.set(elToMove, { translateX: `${dx}px`, translateY: `${dy}px`, scaleX: scale, scaleY: scale });
            // TweenLite.set(elToMove, { scaleX: scale, scaleY: scale });
        });

        // fromEvent(mc, "pan").subscribe((e: HammerInput) => {
        //     const offsetDelta = {
        //         x: e.deltaX,
        //         y: e.deltaY
        //     };

        //     const newViewport = pan(currentViewport, pinchStart, offsetDelta);

        //     const dx = newViewport.position.x;
        //     const dy = newViewport.position.y;

        //     elToMove.style.transform = `
        //     translate(${dx}px, ${dy}px) 
        //     scale(${newViewport.zoom})`;
        // });


        fromEvent(mc, "pinchend panend").subscribe((e: HammerInput) => {
            if (e.type === "panend" && (e as any).maxPointers > 1) return;
            // if(e.isFinal)
            //     return;
            // alert(e.type)
            // if(e.pointers.length === 2 && e.eventType === "panend")
            // const scale = Math.max(1, prevScale * e.scale);
            // const pinch = {
            //     x: pinchStart.x - e.deltaX,
            //     y: pinchStart.y - e.deltaY
            // };
            const offsetDelta = {
                x: e.deltaX,
                y: e.deltaY
            };

            const newViewport = zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, true);

            currentViewport = newViewport;

            const requiredDelta = 50;

            let transformations = newViewport.zoom === 1 ?
                e.deltaX > requiredDelta
                    ? { translateX: `100%`, translateY: '0%', onComplete: () => this.gallery.prev(currentDirectoryId) }
                    : e.deltaX < -requiredDelta
                        ? { translateX: `-100%`, translateY: '0%', onComplete: () => this.gallery.next(currentDirectoryId) }
                        : { translateX: "0%" }
                : { translateX: `${newViewport.position.x}px`, translateY: `${newViewport.position.y}px` };

            TweenLite.to(elToMove, .25, {
                ...transformations,
                scale: newViewport.zoom,
                ease: Expo.easeOut
            });

            // elToMove.style.transform = `
            // translate(${newViewport.position.x}px, ${newViewport.position.y}px) 
            // scale(${newViewport.zoom})`;
            // const scale = Math.max(1, prevScale * e.scale);

            // const preZoomPinchStart = {
            //     x: pinchStart.x * prevScale + prevX,
            //     y: pinchStart.y * prevScale + prevY,
            // };

            // const postZoomPinchStart = {
            //     x: pinchStart.x * scale + prevX - e.deltaX,
            //     y: pinchStart.y * scale + prevY - e.deltaY,
            // };

            // const dx = clampX(prevX - (postZoomPinchStart.x - preZoomPinchStart.x), scale);
            // const dy = clampY(prevY - (postZoomPinchStart.y - preZoomPinchStart.y), scale);

            //     const offsetX = dx;
            //     const offsetY = dy;

            //     // prevX = scale === 1 ? offsetX : clampX(prevX + offsetX, scale);
            //     // prevY = scale === 1 ? 0 : clampY(prevY + offsetY, scale);
            // prevX = dx;
            // prevY = dy;
            // prevScale = scale;
        });


        // // fromEvent(mc, "panend").subscribe((e: HammerInput) => {
        // //     // alert(JSON.stringify(e.changedPointers));
        // //     // alert();
        // //     // alert(e.eventType);

        // //     // const scale = Math.max(1, prevScale * e.scale);

        // //     // const screenCenter = { x: screenWidth / 2, y: screenHeight / 2 };
        // //     // const dx = (pinchStart.x - screenCenter.x) * (prevScale - scale);
        // //     // const dy = (pinchStart.y - screenCenter.y) * (prevScale - scale);

        // //     // // const pinchDx = 

        // //     const offsetX = e.deltaX;
        // //     const offsetY = e.deltaY;

        // //     let ratioX = prevScale === 1 ? offsetX : clampX(prevX + offsetX, prevScale);
        // //     let ratioY = prevScale === 1 ? 0 : clampY(prevY + offsetY, prevScale);

        // //     const requiredDelta = 50;
        // //     // // // // elToMove.style.transform = `translateX(${ratio}%)`;
        // //     let toVars: any = prevScale === 1 ?
        // //         e.deltaX > requiredDelta
        // //             ? { translateX: `100%`, translateY: '0%', onComplete: () => this.gallery.prev(currentDirectoryId) }
        // //             : e.deltaX < -requiredDelta
        // //                 ? { translateX: `-100%`, translateY: '0%', onComplete: () => this.gallery.next(currentDirectoryId) }
        // //                 : { translateX: "0%" }
        // //         : { translateX: `${ratioX}px`, translateY: `${ratioY}px` };
        // //     // { translateX: e.deltaX > 0 ? "100%" : "-100%" }

        // //     if (toVars.translateX === `100%` || toVars.translateX === `-100%`) {
        // //         toVars = {...toVars, scaleY: 1, scaleX: 1};
        // //         // TweenLite.to(elToMove, 0.25, { scaleY: 1, scaleX: 1, ease: Expo.easeOut });
        // //         ratioX = 0;
        // //         ratioY = 0;
        // //     }

        // //     prevX = ratioX;
        // //     prevY = ratioY;

        // //     TweenLite.to(elToMove, 0.25, { ...toVars, ease: Expo.easeOut });
        // //     // elToMove.style.transform = `translate(${e.deltaX}px, 0px)`;
        // // });

        this.currentImage$.subscribe(() => {
            currentViewport = defaultViewport();
            TweenLite.set(elToMove, { translateX: `0px`, translateY: `0px`, scale: `1`});
        });

        // // fromEvent(mc, "swiperight")
        // //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
        // //     .subscribe((g) => {
        // //         elToMove.style.transform = `translate(100%, 0px)`;
        // //         // this.gallery.prev(g.id);
        // //     });

        // // fromEvent(mc, "swipeleft")
        // //     .pipe(flatMap((e: any) => this.currentDirectoryId.pipe(map((id) => ({ id, e })))))
        // //     .subscribe((g) => {
        // //         elToMove.style.transform = `translate(-100%, 0px)`;
        // //         // this.gallery.next(g.id);
        // //     });
        // // }



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
