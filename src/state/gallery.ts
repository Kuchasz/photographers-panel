import { GalleryStates } from "../api/gallery";

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

export interface GalleryStats{
    todayVisits: number;
    totalVisits: number;
    bestDay: string;
    dateRangeDays: number;
    dateRangeVisits: number;
    numberOfEmails: number;
}

export interface GalleriesState{}