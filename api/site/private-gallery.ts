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

export const getGalleryUrlRoute = "/api/private-gallery-url/:password";
export const getGalleryUrl = (password: string) =>
    new Promise<PrivateGalleryUrlCheckResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + getGalleryUrlRoute.replace(":password", password))
            .then(result => result.json())
            .then(resolve);
    });
getGalleryUrl.route = getGalleryUrlRoute;