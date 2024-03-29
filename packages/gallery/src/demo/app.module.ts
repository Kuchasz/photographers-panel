import { ApiService } from "../service/api.service";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AppComponent } from "./component/app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { checkIfMobile } from "../utils/browser";
import { CommonModule } from "@angular/common";
import { DisplayModes } from "../config/gallery.config";
import { fetchGallery } from "../utils/jalbum";
import { GalleryModule } from "../gallery.module";
import { GalleryService } from "../service/gallery.service";
import { getUserName } from "@pp/api/dist/user";

document.querySelector('#state-initializer')?.remove();
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        GalleryModule.forRoot({
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
        }),
    ],
    providers: [
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
