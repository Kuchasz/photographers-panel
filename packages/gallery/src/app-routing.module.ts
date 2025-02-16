import { Routes } from '@angular/router';
import { GalleryDirectoriesComponent } from './component/gallery-directories/gallery-directories.component';
import { GallerySnappedImagesComponent } from './component/gallery-snapped-images/gallery-snapped-images.component';
import { GalleryImagesFullscreenComponent } from './component/gallery-images-fullscreen/gallery-images-fullscreen.component';
import { GalleryImagesGridComponent } from './component/gallery-images-grid/gallery-images-grid.component';
import { APP_BASE_HREF } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

export const routes: Routes = [
    { path: '', component: GalleryDirectoriesComponent },
    { path: 'snapped', component: GallerySnappedImagesComponent },
    {
        path: ':id',
        component: GalleryImagesGridComponent,
        children: [
            {
                path: 'fullscreen',
                component: GalleryImagesFullscreenComponent,
            },
        ],
    },
];

// Export providers if needed elsewhere
export const routingProviders = [
    { provide: APP_BASE_HREF, useValue: '/galeria' }
];
