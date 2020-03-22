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
    visits: number;
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
    visits: number;
}

// {
//     todayVisits: number;
//     totalVisits: number;
//     bestDay: string;
//     bestDayVisits: number;
//     rangeDays: number;
//     rangeVisits: number;
//     emails: number;
// },

export interface GetGalleryVisitsResult {
    todayVisits: number;
    totalVisits: number;
    rangeDays: number;
    rangeVisits: number;
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    emails: number;
}

const getGalleriesListRoute = "/api/panel/galleries-list";
export const getGalleriesList = () => 
    fetch("http://192.168.56.102:8080" + getGalleriesListRoute)
    .then(resp => resp.json() as Promise<Gallery[]>);
getGalleriesList.route = getGalleriesListRoute;

const getGalleryVisitsRoute = "/api/panel/gallery-stats/:start/:end/:galleryId";
export const getGalleryVisits = (startDate: Date, endDate: Date, selectedGallery: number): Promise<GetGalleryVisitsResult> => 
    fetch("http://192.168.56.102:8080" + getGalleryVisitsRoute
        .replace(":start", getDateString(startDate))
        .replace(":end", getDateString(endDate))
        .replace(":galleryId", selectedGallery.toString()))
    .then(resp => resp.json());
getGalleryVisits.route = getGalleryVisitsRoute;

const checkPasswordIsUniqueRoute = "/api/panel/gallery-password-unique/:password";
export const checkPasswordIsUnique = (password: string): Promise<boolean> =>
    fetch("http://192.168.56.102:8080" + checkPasswordIsUniqueRoute
        .replace(":password", password))
        .then(resp => resp.json());
checkPasswordIsUnique.route = checkPasswordIsUniqueRoute;