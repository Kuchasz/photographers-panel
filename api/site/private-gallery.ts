import { endpoint, Result } from "../common";
import { PrivateGalleryState } from "../private-gallery";

export interface PrivateGalleryUrlCheckResult {
    gallery?: PrivateGalleryDetails;
    blog?: BlogDetails;
}

export interface PrivateGalleryDetails {
    id: number;
    state: PrivateGalleryState;
    bride: string;
    groom: string;
    place: string;
    lastName: string;
    url: string;
    date: string;
}

export interface BlogDetails {
    alias: string;
    title: string;
}
export interface Subscription {
    privateGalleryId: number;
    email: string;
}

export type SubscribtionValidationError = "GalleryDoesNotExists" | "AlreadySubscribed" | "EmailInvalid";
export type SubscribtionResult = Result<SubscribtionValidationError>;

const getGalleryUrlRoute = "/api/private-gallery-url/:password";
export const getGalleryUrl = (password: string) =>
    new Promise<PrivateGalleryUrlCheckResult>((resolve, _) => {
        fetch(endpoint + getGalleryUrlRoute.replace(":password", password))
            .then(result => result.json())
            .then(resolve);
    });
getGalleryUrl.route = getGalleryUrlRoute;

const viewGalleryRoute = "/gallery";
export const viewGallery = () => { };
viewGallery.route = viewGalleryRoute;

export const subscribeForNotificationRoute = "/api/subscribe-for-notification";
export const subscribeForNotification = (subscription: Subscription) =>
    new Promise<SubscribtionResult>((resolve, _) => {
        fetch(endpoint + subscribeForNotificationRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription)
        })
            .then(result => result.json())
            .then(resolve);
    });
subscribeForNotification.route = subscribeForNotificationRoute;