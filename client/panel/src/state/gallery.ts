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
    blog: string;
}

export interface GalleryStats{
    todayVisits: number;
    totalVisits: number;
    bestDay: string;
    dateRangeDays: number;
    dateRangeVisits: number;
    numberOfEmails: number;
}

export interface GalleriesState{
    galleries: Gallery[];
    selectedGallery: number;
}

export interface DailyVisits {
    date: string;
    visits: string;
}

export {GalleryStates} from "../api/gallery";