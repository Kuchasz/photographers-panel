/** This directive enable tap if HammerJS is loaded, otherwise it uses the normal click event (useful for thumbnail click) */

import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GalleryService } from '../service/gallery.service';
import * as Hammer from 'hammerjs';

@Directive({
    selector: '[tap]',
})
export class TapDirective implements OnInit {
    @Input() tap: void;
    @Output() tapClick = new EventEmitter();

    constructor(private gallery: GalleryService, private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.setTapEvent();
    }

    /** Enable gestures if hammer is loaded */
    setTapEvent() {
        if (this.gallery.config.gestures) {
            /** Use tap for click event */
            if (typeof Hammer !== 'undefined') {
                const mc = new Hammer(this.el.nativeElement);
                mc.on('tap', () => {
                    this.tapClick.emit(null);
                });
            }
        } else {
            /** Use normal click event */
            this.renderer.setProperty(this.el.nativeElement, 'onclick', (e: Event) => {
                e.stopImmediatePropagation();
                this.tapClick.emit(e);
            });
        }
    }
}
