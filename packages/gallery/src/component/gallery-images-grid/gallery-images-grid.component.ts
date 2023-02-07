import * as events from "@pp/api/dist/event";
import * as user from "@pp/api/dist/user";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ApiService } from "../../service/api.service";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation
    } from "@angular/core";
import { DisplayModes, GalleryConfig } from "../../config/gallery.config";
import {
    distinctUntilChanged,
    flatMap,
    map,
    switchMap
    } from "rxjs/operators";
import { GalleryDirectory, GalleryImage } from "../../service/gallery.state";
import { GalleryService } from "../../service/gallery.service";
import { getOrRegisterName } from "@pp/utils/dist/user";
import { Observable } from "rxjs";
import { sort, sum } from "../../utils/array";

@Component({
    selector: 'gallery-images-grid',
    templateUrl: './gallery-images-grid.component.html',
    styleUrls: ['./gallery-images-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class GalleryImagesGridComponent implements OnInit {
    currentDirectoryId$!: Observable<string>;
    currentDirectory!: Observable<GalleryDirectory>;

    images$!: Observable<GalleryImage[]>;
    config: GalleryConfig;
    columnsImages!: GalleryImage[][];
    fullscreenModeEnabled$!: Observable<boolean>;

    constructor(
        public gallery: GalleryService,
        public api: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.config = gallery.config;
    }

    ngOnInit() {
        this.currentDirectoryId$ = this.route.paramMap.pipe(map((x) => x.get('id')!));
        this.fullscreenModeEnabled$ = this.route.url.pipe(
            map((segments) => segments.filter((s) => s.path === 'fullscreen').length === 0)
        );

        this.images$ = this.currentDirectoryId$.pipe(
            flatMap((directoryId) =>
                this.gallery.state.pipe(
                    map((s) => ({
                        images: s.images,
                        directoryImages: s.directoryImages,
                    })),
                    distinctUntilChanged((prev, curr) => prev.images === curr.images),
                    map((s) => {
                        const ids = s.directoryImages[directoryId];
                        return s.images.filter((i) => ids.includes(i.id));
                    })
                )
            )
        );

        const sumHeights = sum((x: GalleryImage) => x.height/x.width);
        const sortByHeight = sort((x: { height: number }) => x.height);

        const columns =
            this.gallery.config.displayMode === DisplayModes.Compact
                ? ([[]] as GalleryImage[][])
                : ([[], [], [], []] as GalleryImage[][]);

        this.images$.subscribe((images) => {
            let finalImages: GalleryImage[][] = images.reduce((columns, img) => {
                const shorttestColumn = [...columns]
                    .map((items, index) => ({ index, items, height: sumHeights(items) }))
                    .sort((l, r) => l.height - r.height)[0];

                return [
                    ...columns.slice(0, shorttestColumn.index),
                    [...shorttestColumn.items, img],
                    ...columns.slice(shorttestColumn.index + 1),
                ];
                // const leftOrRight = sumHeights(left) > sumHeights(right);
                // return leftOrRight ? ({left, right: [...right, img]}) : ({right, left: [...left, img]});
            }, columns);

            const columnsWithHeights = finalImages.map((images) => ({
                height: sumHeights(images),
                images,
            }));

            const shortestColumn = sortByHeight(columnsWithHeights)[0];

            const columnsWithAdjustments = columnsWithHeights.map((c) => ({
                images: c.images,
                adjustment: shortestColumn.height / c.height,
            }));

            finalImages = columnsWithAdjustments.map((c) =>
                c.images.map((img) => Object.assign(img, { height: img.height * c.adjustment }))
            );

            // const finalImages = images.reduce(
            //     (agg, image) => agg.map(col => {height: sumHeights(col), col}),
            //     [[],[],[],[]]
            // );

            this.columnsImages = finalImages;

            // this.leftColImages = finalImages.left;
            // this.rightColImages = finalImages.right;
        });

        this.currentDirectory = this.currentDirectoryId$.pipe(
            switchMap((directoryIndex) => this.gallery.getDirectory(directoryIndex))
        );
    }

    onImageLoad($event: Event) {
        const image = $event.target as HTMLImageElement;

        const container = image.parentElement as HTMLDivElement;

        container.className += ' loaded';
    }

    enableFullscreenMode(imageId: string, directoryId: string) {
        // this.fullscreenModeEnabled = true;
        this.gallery.selectImage(imageId, directoryId);

        // this.router.onSameUrlNavigation = 'ignore';

        this.router.navigate([`fullscreen`], { relativeTo: this.route });

        // this.router.routeReuseStrategy.shouldReuseRoute = () => true;
        // this.router.navigate([`fullscreen`], { relativeTo: this.route });
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    public likeImage(imageId: string, $event: MouseEvent) {
        this.gallery.likeImage(imageId);
        this.api.sdk.likeImage({ imageId, clientId: this.api.clientId });
        events.reqisterEvent(events.EventType.PhotoLiked, getOrRegisterName(user.getUserName) as user.UserName);
        $event.stopPropagation();
    }

    public unlikeImage(imageId: string, $event: MouseEvent) {
        // this.gallery.unlikeImage(imageId);
        // this.api.sdk.unlikeImage({ imageId, clientId: this.api.clientId });
        // events.reqisterEvent(events.EventType.PhotoUnliked, getOrRegisterName(user.getUserName) as user.UserName);
        $event.stopPropagation();
    }

    // disableFullscreenMode(){
    //     this.fullscreenModeEnabled = false;
    // }
}
