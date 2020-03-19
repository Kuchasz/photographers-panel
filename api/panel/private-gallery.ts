import { getDateString } from "../../utils/date";
import { PrivateGalleryState } from "../private-gallery";

export interface GalleryStats {
    todayVisits: number;
    totalVisits: number;
    bestDay: string;
    dateRangeDays: number;
    dateRangeVisits: number;
    numberOfEmails: number;
}

export interface VisitsSummary {
    date: string;
    visits: string;
}

export interface Gallery {
    id: number;
    date: string;
    place: string;
    bride: string;
    groom: string;
    lastName: string;
    state: PrivateGalleryState;
    password: string;
    url: string;
    blogId: string;
}

export interface GetGalleryVisitsResult {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}

export const getGalleriesList = () => 
    fetch('http://api.pyszstudio.pl/Galleries/Index')
    .then(resp => resp.json() as Promise<Gallery[]>);

export const getGalleryVisits = (startDate: Date, endDate: Date, selectedGallery: number): Promise<GetGalleryVisitsResult> => 
    fetch(`http://api.pyszstudio.pl/Galleries/Visits?startDate=${getDateString(startDate)}&endDate=${getDateString(endDate)}&galleryId=${selectedGallery}`)
    .then(resp => resp.json())