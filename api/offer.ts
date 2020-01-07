export interface OfferListItem {
    title: string;
    alias: string;
    summary: string;
    photoUrl: string;
}

export interface OfferPhoto{
    url: string;
    altText: string;
}

export interface OfferEntry {
    title: string;
    description: string;
    photos: OfferPhoto[];
}

const getOffersListRoute = "/api/offers-list";
export const getOffersList = () =>
    new Promise<OfferListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getOffersListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getOffersList.route = getOffersListRoute;

const getOfferRoute = "/api/offer/:alias";
export const getOffer = (alias: string) =>
    new Promise<OfferEntry>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getOfferRoute.replace(":alias", alias))
            .then(result => result.json())
            .then(resolve);
    });
    getOffer.route = getOfferRoute;