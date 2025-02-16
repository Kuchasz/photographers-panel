import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryService } from './service/gallery.service';
import { GalleryConfig } from './config/gallery.config';

import { GalleryComponent } from './component/gallery/gallery.component';
import { GalleryNavComponent } from './component/gallery-nav/gallery-nav.component';
import { GalleryThumbComponent } from './component/gallery-thumb/gallery-thumb.component';
import { GalleryStateComponent } from './component/gallery-state/gallery-state.component';
import { GalleryImageComponent } from './component/gallery-image/gallery-image.component';
import { GalleryLoaderComponent } from './component/gallery-loader/gallery-loader.component';
import { GalleryImagesFullscreenComponent } from './component/gallery-images-fullscreen/gallery-images-fullscreen.component';
import { GallerySnappedImagesComponent } from './component/gallery-snapped-images/gallery-snapped-images.component';
import { GallerySnappedStateComponent } from './component/gallery-snapped-state/gallery-snapped-state.component';
import { GalleryImagesGridComponent } from './component/gallery-images-grid/gallery-images-grid.component';
import { RatingRequestWindowComponent } from './component/rating-request-window/rating-request-window.component';
import { GalleryDirectoriesComponent } from './component/gallery-directories/gallery-directories.component';

import { LazyDirective } from './directive/lazy.directive';
import { LazySrcDirective } from './directive/lazy-src.directive';
import { TapDirective } from './directive/tap.directive';
import { ApiService } from './service/api.service';
import { RouterModule } from '@angular/router';

/** Initialize ConfigService with URL */
export function galleryFactory(config: GalleryConfig) {
    const galleryService = new GalleryService();
    galleryService.setConfig(config);
    return galleryService;
}

export const CONFIG = new InjectionToken<GalleryConfig>('config');

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        GalleryComponent,
        GalleryNavComponent,
        GalleryThumbComponent,
        GalleryStateComponent,
        GalleryImageComponent,
        GalleryLoaderComponent,
        GalleryDirectoriesComponent,
        GalleryImagesFullscreenComponent,
        GallerySnappedImagesComponent,
        GallerySnappedStateComponent,
        GalleryImagesGridComponent,
        RatingRequestWindowComponent,
        LazyDirective,
        LazySrcDirective,
        TapDirective
    ],
    exports: [
        GalleryComponent,
        GalleryNavComponent,
        GalleryThumbComponent,
        GalleryStateComponent,
        GalleryImageComponent,
        GalleryLoaderComponent,
        GalleryDirectoriesComponent,
        GalleryImagesFullscreenComponent,
        GallerySnappedImagesComponent,
        GallerySnappedStateComponent,
        GalleryImagesGridComponent,
        RatingRequestWindowComponent,
        LazyDirective,
        LazySrcDirective,
        TapDirective
    ]
})
export class GalleryModule {
    static forRoot(config?: GalleryConfig): ModuleWithProviders<GalleryModule> {
        return {
            ngModule: GalleryModule,
            providers: [
                { provide: CONFIG, useValue: config },
                {
                    provide: GalleryService,
                    useFactory: galleryFactory,
                    deps: [CONFIG],
                },
                {
                    provide: ApiService,
                    useValue: new ApiService(),
                },
            ],
        };
    }
}
