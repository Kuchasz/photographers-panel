export interface OfferListItem {
    title: string;
    alias: string;
    summary: string;
    photoUrl: string;
}

const getOffersListRoute = "/api/offers-list";
export const getOffersList = () =>
    new Promise<OfferListItem[]>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getOffersListRoute)
            .then(result => result.json())
            .then(resolve);
    });
getOffersList.route = getOffersListRoute;