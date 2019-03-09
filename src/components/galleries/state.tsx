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
    isSelected: boolean;
}

export interface GalleriesVistsRootObject {
    bestDay: VisitsSummary;
    dailyVisits: VisitsSummary[];
    sumOfVisits: number;
    rangeSumOfVisits?: number;
}