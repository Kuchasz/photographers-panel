import { endpoint as privateGallery } from "../common";
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
        fetch(privateGallery + getGalleryUrlRoute.replace(":password", password))
            .then(result => result.json())
            .then(resolve);
    });
getGalleryUrl.route = getGalleryUrlRoute;

export const viewGalleryUrlRoute = "/gallery";
export const viewGalleryUrl = () => { };
viewGalleryUrl.route = viewGalleryUrlRoute;