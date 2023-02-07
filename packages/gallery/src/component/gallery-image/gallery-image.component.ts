import * as Hammer from "hammerjs";
import { ActivatedRoute } from "@angular/router";
import { animation } from "./gallery-image.animation";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnInit,
    Renderer2
} from "@angular/core";
import { clamp } from "../../utils/number";
import { DisplayModes } from "../../config/gallery.config";
import { Expo, gsap } from "gsap";
import {
    first,
    flatMap,
    map,
    switchMap,
    tap
} from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";
import { GalleryConfig } from "../../config";
import { GalleryDirectory, GalleryImage, GalleryState } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";

@Component({
    selector: 'gallery-image',
    templateUrl: './gallery-image.component.html',
    styleUrls: ['./gallery-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: animation,
})
export class GalleryImageComponent implements OnInit {
    @Input() state!: GalleryState;
    @Input() config!: GalleryConfig;
    loading: boolean = true;
    animate!: string;

    currentDirectoryId!: Observable<string>;
    currentImage$!: Observable<[GalleryImage, GalleryImage, GalleryImage]>;
    currentDirectory!: Observable<GalleryDirectory>;
    currentImage!: [GalleryImage, GalleryImage, GalleryImage];

    constructor(public gallery: GalleryService, private el: ElementRef, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        function getRenderedSize(contains: boolean, cWidth: number, cHeight: number, width: number, height: number) {
            var oRatio = width / height,
                cRatio = cWidth / cHeight;
            return function (this: { left: number; right: number; width: number; height: number }) {
                if (contains ? oRatio > cRatio : oRatio < cRatio) {
                    this.width = cWidth;
                    this.height = cWidth / oRatio;
                } else {
                    this.width = cHeight * oRatio;
                    this.height = cHeight;
                }
                this.left = cWidth - this.width;
                this.right = this.width + this.left;
                return this;
            }.call({ left: 0, right: 0, width: 0, height: 0 });
        }

        this.currentDirectoryId = this.route!.parent!.paramMap.pipe(map((x) => x.get('id')!));

        this.currentDirectory = this.currentDirectoryId.pipe(
            switchMap((directoryId) => this.gallery.getDirectory(directoryId))
        );

        this.currentImage$ = this.gallery.state.pipe(
            map((x) => ({
                images: x.images,
                currId: x.currId,
                prevId: x.prevId,
                nextId: x.nextId,
            })),
            map((x) => [
                x.images.find((xx) => xx.id === x.prevId)!,
                x.images.find((xx) => xx.id === x.currId)!,
                x.images.find((xx) => xx.id === x.nextId)!,
            ])
        );

        this.currentImage$.subscribe((ci) => (this.currentImage = ci));

        if (this.config.displayMode !== DisplayModes.Compact) return;

        // if (this.config.gestures) {
        // const _el = this.el.nativeElement;
        // // const elToMove = this.el.nativeElement.querySelector(".g-image-container");
        const elToMove = this.el.nativeElement.querySelector('.g-image-container');
        const el = this.el.nativeElement; //.querySelector(".curr");
        const image = this.el.nativeElement.querySelector('.curr');

        // // console.log(el);

        const mc = new Hammer.Manager(el);
        mc.add(new Hammer.Pan({ enable: true, pointers: 1 }));
        mc.add(new Hammer.Pinch({ enable: true }));

        let canvasSize: { width: number; height: number };
        let imgSize: { width: number; height: number };

        type Position2D = {
            x: number;
            y: number;
        };

        type Viewport = {
            position: Position2D;
            offsetDelta: Position2D;
            zoom: number;
        };

        const zoomAtPosition = (
            currentViewport: Viewport,
            zoomOffset: number,
            position: Position2D,
            offsetDelta: Position2D,
            returnToHome: boolean
        ): Viewport => {
            const clampZoom = clamp(1, Number.MAX_VALUE);
            const newViewport = {
                position: {
                    x: position.x - (position.x - currentViewport.position.x) * zoomOffset + offsetDelta.x,
                    y: position.y - (position.y - currentViewport.position.y) * zoomOffset + offsetDelta.y,
                },
                zoom: clampZoom(currentViewport.zoom * zoomOffset),
                offsetDelta: {
                    x: currentViewport.offsetDelta.x + offsetDelta.x,
                    y: currentViewport.offsetDelta.y + offsetDelta.y,
                },
            };

            const originalYOffset = (canvasSize.height - imgSize.height) / 2;
            const clampx = clamp(
                -(imgSize.width * newViewport.zoom) + canvasSize.width,
                -(canvasSize.width - imgSize.width)
            );
            const clampy = clamp(
                -originalYOffset * newViewport.zoom,
                (-(canvasSize.height - imgSize.height) / 2) * newViewport.zoom -
                imgSize.height * newViewport.zoom +
                canvasSize.height
            );

            const x =
                canvasSize.width <= imgSize.width * newViewport.zoom
                    ? newViewport.zoom === 1 && !returnToHome
                        ? newViewport.position.x
                        : clampx(newViewport.position.x)
                    : (canvasSize.width - canvasSize.width * newViewport.zoom) / 2;

            const y =
                canvasSize.height <= imgSize.height * newViewport.zoom
                    ? clampy(newViewport.position.y)
                    : (canvasSize.height - canvasSize.height * newViewport.zoom) / 2;

            const dx = x;
            const dy = y;

            return { ...newViewport, position: { x: dx, y: dy } };
        };

        // // let posX = 0;
        // // let posY = 0;

        let pinchStart = { x: 0, y: 0 };

        const defaultViewport = () => ({
            zoom: 1,
            position: {
                x: 0,
                y: 0,
            },
            offsetDelta: {
                x: 0,
                y: 0,
            },
        });

        let currentViewport: Viewport = defaultViewport();
        // // let pinchProgress = false;

        let currentDirectoryId = '';
        this.currentDirectoryId.subscribe((v) => {
            currentDirectoryId = v;
        });

        // // // let prevPosX = 0;
        // // // let prevPosY = 0;
        // // //awdawd
        // // fromEvent(mc, "panstart").subscribe((e: HammerInput) => {

        // //     // console.log(screenWidth, screenHeight);
        // // });

        fromEvent(mc as any, 'pinchstart panstart').subscribe((e: any) => {
            // screenWidth = ;//window.innerWidth;
            // screenHeight = ;
            canvasSize = {
                width: elToMove.clientWidth,
                height: elToMove.clientHeight,
            };
            // imgSize = { width: image.clientWidth, height: image.clientHeight };
            imgSize = getRenderedSize(
                true,
                canvasSize.width,
                canvasSize.height,
                this.currentImage[1].width,
                this.currentImage[1].height
            );
            pinchStart = {
                x: e.center.x, // * prevScale,
                y: e.center.y, //* prevScale
            };
            // realPinchStart = {
            //     x: e.center.x * prevScale - prevX,
            //     y: e.center.y * prevScale - prevY
            // };
        });

        fromEvent(mc as any, 'pinch pan').subscribe((e: any) => {
            if (e.type === 'pan' && (e as any).maxPointers > 1) return;

            const offsetDelta = {
                x: e.deltaX,
                y: e.deltaY,
            };

            const newViewport =
                e.type === 'pan'
                    ? zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, false)
                    : zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, true);

            gsap.to(elToMove, {
                duration: 0.25,
                translateX: `${newViewport.position.x}px`,
                translateY: `${newViewport.position.y}px`,
                scale: newViewport.zoom,
                ease: Expo.easeOut,
            });
        });

        fromEvent(mc as any, 'pinchend panend').subscribe((e: any) => {
            if (e.type === 'panend' && (e as any).maxPointers > 1) return;

            const offsetDelta = {
                x: e.deltaX,
                y: e.deltaY,
            };

            const newViewport = zoomAtPosition(currentViewport, e.scale, pinchStart, offsetDelta, true);

            currentViewport = newViewport;

            const requiredDelta = 50;

            let transformations =
                newViewport.zoom === 1
                    ? e.deltaX > requiredDelta
                        ? {
                            translateX: `100%`,
                            translateY: '0%',
                            onComplete: () => { this.gallery.prev(currentDirectoryId); this.cdRef.detectChanges() },
                        }
                        : e.deltaX < -requiredDelta
                            ? {
                                translateX: `-100%`,
                                translateY: '0%',
                                onComplete: () => { this.gallery.next(currentDirectoryId); this.cdRef.detectChanges() },
                            }
                            : { translateX: '0%' }
                    : {
                        translateX: `${newViewport.position.x}px`,
                        translateY: `${newViewport.position.y}px`,
                    };

            gsap.to(elToMove, {
                duration: 0.25,
                ...transformations,
                scale: newViewport.zoom,
                ease: Expo.easeOut,
            });
        });

        this.currentImage$.subscribe(() => {
            currentViewport = defaultViewport();
            gsap.set(elToMove, {
                translateX: `0px`,
                translateY: `0px`,
                scale: `1`,
            });
        });
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
