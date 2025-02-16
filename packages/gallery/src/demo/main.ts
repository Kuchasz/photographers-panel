import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './component/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { checkIfMobile, checkIfSafari } from "../utils/browser";
import { APP_INITIALIZER } from '@angular/core';
import { GalleryService } from '../service/gallery.service';
import { ApiService } from '../service/api.service';
import { fetchGallery } from '../utils/jalbum';
import { getUserName } from '@pp/api/dist/user';
import { DisplayModes } from '../config/gallery.config';
import { GalleryModule } from '../gallery.module';
// import "./styles.scss";
import "@angular/compiler";
// import "core-js";
// import "zone.js/dist/zone";
import "whatwg-fetch";
// import "roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss";

// import '@mdi/font';

import { routes } from '../app-routing.module';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        {
            provide: APP_INITIALIZER,
            useFactory: (galleries: GalleryService, api: ApiService) => {
                return () =>
                    new Promise<void>(async (res, rej) => {
                        const { galleryUrl: root, galleryId }: { galleryUrl: string; galleryId: number } = (
                            window as any
                        ).___InitialState___ ?? {
                            galleryUrl: '/you-are-missing-something-here/',
                            galleryId: 1,
                        };

                        const gallery = await fetchGallery(root);
                        const clientId = await api.connect(getUserName(), galleryId);
                        const likesResult = await api.sdk.likes({ clientId });
                        galleries.load(gallery, likesResult.likes);
                        res();
                    });
            },
            deps: [GalleryService, ApiService],
            multi: true,
        },
        GalleryService,
        ApiService,
        {
            provide: 'GALLERY_CONFIG',
            useValue: {
                style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    width: '100%',
                    height: '100%',
                },
                description: {
                    position: 'bottom',
                    overlay: false,
                    text: true,
                    counter: true,
                },
                thumbnails: {
                    width: 95,
                    height: 95,
                    position: 'bottom',
                    space: 20,
                },
                navigation: {},
                gestures: checkIfMobile(),
                displayMode: checkIfMobile() ? DisplayModes.Compact : DisplayModes.Full,
            }
        }
    ]
}).catch(err => console.error(err));

const setViewport = () => {
    const viewportTricks = !checkIfSafari() && checkIfMobile();

    const { innerWidth, innerHeight } = window;
    const { offsetWidth } = document.body;

    const v = viewportTricks
        ? {
            vw: `100%`,
            vh: `${Math.round((offsetWidth / innerWidth) * innerHeight)}px`,
        }
        : { vw: '100%', vh: '100%' };

    // console.log(v);

    document.documentElement.style.setProperty('--vh', v.vh);
    document.documentElement.style.setProperty('--vw', v.vw);
};

setViewport();
window.addEventListener('resize', setViewport);
