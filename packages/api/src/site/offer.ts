export interface OfferListItem {
    title: string;
    alias: string;
    summary: string;
    photoUrl: string;
}

export interface OfferPhoto {
    url: string;
    altText: string | null;
}

export interface OfferEntry {
    title: string;
    summary?: string;
    description: string;
    photos: OfferPhoto[];
}
