import { Result } from "./common";

export interface Subscription {
    privateGalleryId: number;
    email: string;
}

export const route = "/api/subscribe-for-notification";

export type SubscribtionValidationError = "GalleryDoesNotExists" | "AlreadySubscribed" | "EmailInvalid";

export type SubscribtionResult = Result<SubscribtionValidationError>;

export const subscribeForNotification = (subscription: Subscription) =>
    new Promise<SubscribtionResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + route, {
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
