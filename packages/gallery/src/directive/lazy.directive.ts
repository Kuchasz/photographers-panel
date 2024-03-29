import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2
    } from "@angular/core";
import { Subject } from "rxjs";

@Directive({
    selector: '[lazyImage]',
})
export class LazyDirective {
    @Input('thumb')
    thumbUrl!: string;

    @Input('lazyImage')
    set lazyImage(imagePath: string) {
        this.getImage(imagePath);
    }

    img: string = '';
    lazyWorker = new Subject<string>();

    @Output() lazyLoad = new EventEmitter<boolean>(false);

    imageLoad: any;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        // this.lazyWorker.subscribe((img) => {
        //     if (img) {
        // this.lazyLoad.emit(true);
        //     } else {
        //         // this.lazyLoad.emit(false);
        //     }
        // });
    }

    getImage(imagePath: string): void {
        this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${imagePath})`);

        // this.lazyWorker.next(this.thumbUrl);
        // this.lazyLoad.emit(false);

        // if (this.imageLoad) this.imageLoad.onload = undefined;

        // this.imageLoad = this.renderer.createElement("img");

        // this.imageLoad.src = imagePath;

        // this.imageLoad.onload = () => {
        // this.lazyWorker.next(imagePath);
        // };

        // this.imageLoad.onerror = (err: Error) => {
        // this.lazyWorker.next(undefined);
        // };
    }
}
