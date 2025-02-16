import { Directive, ElementRef, Input, Output, EventEmitter, Renderer2, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

@Directive({
    selector: '[lazySrc]',
    standalone: false
})
export class LazySrcDirective implements OnInit, OnDestroy {
    @Input('lazySrc')
    set lazyImage(imagePath: string) {
        this.getImage(imagePath);
    }

    img: string = '';
    lazyWorker = new Subject<string>();

    @Output() lazyLoad = new EventEmitter<boolean>(false);

    imageLoad: any;

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnDestroy(): void {
        
    }

    ngOnInit(): void {
        
    }

    getImage(imagePath: string): void {
        this.renderer.setAttribute(this.el.nativeElement, 'src', imagePath);
    }
}
