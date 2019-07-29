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
    blog: string;
}

export interface GalleriesVistsRootObject {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}