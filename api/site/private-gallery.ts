import { Result, f } from '../common';
import { PrivateGalleryState } from '../private-gallery';

export interface PrivateGalleryUrlCheckResult {
    gallery?: PrivateGalleryDetails;
    blog?: BlogDetails;
}

export interface PrivateGalleryDetails {
    id: number;
    state: PrivateGalleryState;
    title: string;
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

export type SubscribtionValidationError = 'GalleryDoesNotExists' | 'AlreadySubscribed' | 'EmailInvalid';
export type SubscribtionResult = Result<SubscribtionValidationError>;

const getGalleryUrlRoute = '/api/private-gallery-url/:password';
export const getGalleryUrl = (password: string) =>
    f.get<PrivateGalleryUrlCheckResult>(getGalleryUrlRoute.replace(':password', password));
getGalleryUrl.route = getGalleryUrlRoute;

const viewGalleryRoute = '/galeria';
export const viewGallery = () => {};
viewGallery.route = viewGalleryRoute;

export const subscribeForNotificationRoute = '/api/subscribe-for-notification';
export const subscribeForNotification = (subscription: Subscription) =>
    f.post<SubscribtionResult>(subscribeForNotificationRoute, subscription);
subscribeForNotification.route = subscribeForNotificationRoute;
