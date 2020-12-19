import { getDateString } from "@pp/utils/date";
import { PrivateGalleryState } from "../private-gallery";
import { endpoint, Result } from "../common";
import { VisitsSummaryDto } from "./visits";

export interface GalleryDto {
    id: number;
    date: string;
    title: string;
    notes: string;
    state: PrivateGalleryState;
    password: string;
    blogId: number;
    visits: number;
    pendingNotification: boolean;
}

export interface GalleryVisitsDto {
    todayVisits: number;
    totalVisits: number;
    rangeDays: number;
    rangeVisits: number;
    bestDay: VisitsSummaryDto;
    dailyVisits: VisitsSummaryDto[];
    emails: number;
}

export interface GalleryEditDto {
    date: string;
    title: string;
    notes: string;
    state: PrivateGalleryState;
    password: string;
    directPath: string;
    blog?: number;
}

export interface GalleryEmailDto {
    address: string;
}

export interface GalleryEmailsDto {
    emails: GalleryEmailDto[];
    pendingNotification: boolean;
}

export type CreateGalleryError = "ErrorOccuredWhileCreatingGallery";
export type CreateGalleryResult = Result<CreateGalleryError>;

export type EditGalleryError = "ErrorOccuredWhileEditingGallery";
export type EditGalleryResult = Result<EditGalleryError>;

export type DeleteGalleryError = "ErrorOccuredWhileDeletingGallery";
export type DeleteGalleryResult = Result<DeleteGalleryError>;

export type NotifySubscribersError = "ErrorOccuredWhileNotifyingSubsribers";
export type NotifySubscribersResult = Result<NotifySubscribersError>;

const getGalleriesListRoute = "/api/panel/galleries-list";
export const getGalleriesList = () =>
    fetch(endpoint + getGalleriesListRoute).then(resp => resp.json() as Promise<GalleryDto[]>);
getGalleriesList.route = getGalleriesListRoute;

const getGalleryVisitsRoute = "/api/panel/gallery-stats/:start/:end/:galleryId";
export const getGalleryVisits = (
    startDate: Date,
    endDate: Date,
    selectedGallery: number
): Promise<GalleryVisitsDto> =>
    fetch(
        endpoint +
        getGalleryVisitsRoute
            .replace(":start", getDateString(startDate))
            .replace(":end", getDateString(endDate))
            .replace(":galleryId", selectedGallery.toString())
    ).then(resp => resp.json());
getGalleryVisits.route = getGalleryVisitsRoute;

const checkPasswordIsUniqueRoute = "/api/panel/gallery-password-unique/:password/:galleryId?";
export const checkPasswordIsUnique = (galleryId?: number) => (password: string): Promise<boolean> =>
    fetch(endpoint + checkPasswordIsUniqueRoute.replace(":password", password).replace(":galleryId?", galleryId?.toString() ?? "")).then(resp =>
        resp.json()
    );
checkPasswordIsUnique.route = checkPasswordIsUniqueRoute;

const createGalleryRoute = "/api/panel/create-gallery";
export const createGallery = (gallery: GalleryEditDto) =>
    new Promise<CreateGalleryResult>((resolve, _) => {
        fetch(endpoint + createGalleryRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gallery)
        })
            .then(result => result.json())
            .then(resolve);
    });
createGallery.route = createGalleryRoute;

const getGalleryForEditRoute = "/api/panel/gallery-for-edit/:galleryId";
export const getGalleryForEdit = (id: number) =>
    fetch(endpoint + getGalleryForEditRoute.replace(":galleryId", id.toString())).then(
        resp => resp.json() as Promise<GalleryEditDto>
    );
getGalleryForEdit.route = getGalleryForEditRoute;

const editGalleryRoute = "/api/panel/edit-gallery";
export const editGallery = (id: number, gallery: GalleryEditDto) =>
    new Promise<EditGalleryResult>((resolve, _) => {
        fetch(endpoint + editGalleryRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, gallery })
        })
            .then(result => result.json())
            .then(resolve);
    });
editGallery.route = editGalleryRoute;

const deleteGalleryRoute = "/api/panel/remove-gallery";
export const deleteGallery = (id: number) =>
    new Promise<DeleteGalleryResult>((resolve, _) => {
        fetch(endpoint + deleteGalleryRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then(result => result.json())
            .then(resolve);
    });
deleteGallery.route = deleteGalleryRoute;

const getGalleryEmailsRoute = "/api/panel/gallery-emails/:galleryId";
export const getGalleryEmails = (
    selectedGallery: number
): Promise<GalleryEmailsDto> =>
    fetch(
        endpoint +
        getGalleryEmailsRoute
            .replace(":galleryId", selectedGallery.toString())
    ).then(resp => resp.json());
getGalleryEmails.route = getGalleryEmailsRoute;

const notifySubscribersRoute = "/api/panel/notify-subscribers";
export const notifySubscribers = (
    selectedGallery: number
): Promise<NotifySubscribersResult> =>
    fetch(
        endpoint + notifySubscribersRoute, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: selectedGallery })
    }).then(resp => resp.json());
notifySubscribers.route = notifySubscribersRoute;