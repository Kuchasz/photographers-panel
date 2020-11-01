import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GalleryService } from "./service/gallery.service";
import { GalleryConfig } from "./config/gallery.config";
import { AppRoutingModule } from "./app-routing.module";

import { GalleryComponent } from "./component/gallery/gallery.component";
import { GalleryNavComponent } from "./component/gallery-nav/gallery-nav.component";
import { GalleryThumbComponent } from "./component/gallery-thumb/gallery-thumb.component";
import { GalleryStateComponent } from "./component/gallery-state/gallery-state.component";
import { GalleryImageComponent } from "./component/gallery-image/gallery-image.component";
import { GalleryLoaderComponent } from "./component/gallery-loader/gallery-loader.component";
import { GalleryPlayerComponent } from "./component/gallery-player/gallery-player.component";
import { GalleryImagesFullscreenComponent } from "./component/gallery-images-fullscreen/gallery-images-fullscreen.component";
import { GallerySnappedImagesComponent } from "./component/gallery-snapped-images/gallery-snapped-images.component";
import { GallerySnappedStateComponent } from "./component/gallery-snapped-state/gallery-snapped-state.component";
import { GalleryImagesGridComponent } from "./component/gallery-images-grid/gallery-images-grid.component";
import { RatingRequestWindowComponent } from "./component/rating-request-window/rating-request-window.component";

import { LazyDirective } from "./directive/lazy.directive";
import { TapDirective } from "./directive/tap.directive";
import { GalleryDirectoriesComponent } from "./component/gallery-directories/gallery-directories.component";
import { ApiService } from "./service/api.service";

/** Initialize ConfigService with URL */
export function galleryFactory(config: GalleryConfig) {
    return new GalleryService(config);
}

export const CONFIG = new InjectionToken<GalleryConfig>("config");

@NgModule({
    imports: [CommonModule, AppRoutingModule],
    declarations: [
        GalleryComponent,
        GalleryNavComponent,
        GalleryThumbComponent,
        GalleryStateComponent,
        GalleryImageComponent,
        GalleryLoaderComponent,
        GalleryPlayerComponent,
        GalleryDirectoriesComponent,
        GalleryImagesFullscreenComponent,
        GallerySnappedImagesComponent,
        GallerySnappedStateComponent,
        GalleryImagesGridComponent,
        RatingRequestWindowComponent,
        TapDirective,
        LazyDirective
    ],
    exports: [GalleryComponent]
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
                    deps: [CONFIG]
                },
                {
                    provide: ApiService,
                    useValue: new ApiService()
                }
            ]
        };
    }
}
