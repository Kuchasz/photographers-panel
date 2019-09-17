import { getDateString } from "../utils/date";

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
    bride: string;
    groom: string;
    lastname: string;
    state: GalleryStates;
    pass: string;
    dir: string;
    BlogEntryId: string;
}

export interface GalleriesVistsRootObject {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}

export const getAll = () => 
    fetch('http://api.pyszstudio.pl/Galleries/Index')
    .then(resp => resp.json() as Promise<Gallery[]>);

export const getVisits = (startDate: Date, endDate: Date, selectedGallery: number) => 
    fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${getDateString(startDate)}&endDate=${getDateString(endDate)}&galleryId=${selectedGallery}`)
    .then(resp => resp.json())