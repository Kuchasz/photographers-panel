export interface Subscription {
    privateGalleryId: string;
    email: string;
}

export const route = "/api/subscribe-for-notification";

export const subscribeForNotification = (subscription: Subscription) =>
    new Promise<void>((resolve, _) => {
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
