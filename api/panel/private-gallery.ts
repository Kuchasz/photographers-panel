import { getDateString } from "@pp/utils/date";
import { PrivateGalleryState } from "../private-gallery";
import { Result, f } from "../common";
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
    f.get<GalleryDto[]>(getGalleriesListRoute);
getGalleriesList.route = getGalleriesListRoute;

const getGalleryVisitsRoute = "/api/panel/gallery-stats/:start/:end/:galleryId";
export const getGalleryVisits = (startDate: Date, endDate: Date, selectedGallery: number) =>
    f.get<GalleryVisitsDto>(getGalleryVisitsRoute
        .replace(":start", getDateString(startDate))
        .replace(":end", getDateString(endDate))
        .replace(":galleryId", selectedGallery.toString()));
getGalleryVisits.route = getGalleryVisitsRoute;

const checkPasswordIsUniqueRoute = "/api/panel/gallery-password-unique/:password/:galleryId?";
export const checkPasswordIsUnique = (galleryId?: number) => (password: string) =>
    f.get<boolean>(checkPasswordIsUniqueRoute
        .replace(":password", password)
        .replace(":galleryId?", galleryId?.toString() ?? ""));
checkPasswordIsUnique.route = checkPasswordIsUniqueRoute;

const createGalleryRoute = "/api/panel/create-gallery";
export const createGallery = (gallery: GalleryEditDto) =>
    f.post<CreateGalleryResult>(createGalleryRoute, gallery);
createGallery.route = createGalleryRoute;

const getGalleryForEditRoute = "/api/panel/gallery-for-edit/:galleryId";
export const getGalleryForEdit = (id: number) =>
    f.get<GalleryEditDto>(getGalleryForEditRoute.replace(":galleryId", id.toString()));
getGalleryForEdit.route = getGalleryForEditRoute;

const editGalleryRoute = "/api/panel/edit-gallery";
export const editGallery = (id: number, gallery: GalleryEditDto) =>
    f.post<EditGalleryResult>(editGalleryRoute, { id, gallery });
editGallery.route = editGalleryRoute;

const deleteGalleryRoute = "/api/panel/remove-gallery";
export const deleteGallery = (id: number) =>
    f.post<DeleteGalleryResult>(deleteGalleryRoute, { id });
deleteGallery.route = deleteGalleryRoute;

const getGalleryEmailsRoute = "/api/panel/gallery-emails/:galleryId";
export const getGalleryEmails = (selectedGallery: number) =>
    f.get<GalleryEmailsDto>(getGalleryEmailsRoute.replace(":galleryId", selectedGallery.toString()));
getGalleryEmails.route = getGalleryEmailsRoute;

const notifySubscribersRoute = "/api/panel/notify-subscribers";
export const notifySubscribers = (selectedGallery: number) =>
    f.post<NotifySubscribersResult>(notifySubscribersRoute, { id: selectedGallery });
notifySubscribers.route = notifySubscribersRoute;