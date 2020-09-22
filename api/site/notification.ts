import { endpoint, Result } from "../common";

export interface Subscription {
    privateGalleryId: number;
    email: string;
}

export type SubscribtionValidationError = "GalleryDoesNotExists" | "AlreadySubscribed" | "EmailInvalid";

export type SubscribtionResult = Result<SubscribtionValidationError>;

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