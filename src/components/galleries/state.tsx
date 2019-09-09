import {Gallery as ApiGallery} from "../../api/gallery";

export interface VisitsSummary {
    date: string;
    visits: string;
}

export enum GalleryStates {
    NotReady = "0",
    Available = "1",
    TurnedOff = "2"
}

export interface Gallery {
    id: number;
    date: string;
    place: string;
    brideName: string;
    groomName: string;
    lastName: string;
    state: GalleryStates;
    password: string;
    directoryName: string;
    blog: number;
}

export interface GalleriesVistsRootObject {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}

export const fromApiGallery = (gallery: ApiGallery): Gallery => ({
    id: gallery.id,
    date: gallery.date,
    place: gallery.place,
    brideName: gallery.bride,
    groomName: gallery.groom,
    lastName: gallery.lastname,
    state: gallery.state,
    password: gallery.pass,
    directoryName: gallery.dir,
    blog: Number(gallery.BlogEntryId)
});