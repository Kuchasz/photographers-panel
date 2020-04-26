import { getDateString } from "../../utils/date";
import { PrivateGalleryState } from "../private-gallery";
import { Result } from "../common";

export interface VisitsSummaryDto {
    date: string;
    visits: number;
}

export interface GalleryDto {
    id: number;
    date: string;
    place: string;
    bride: string;
    groom: string;
    lastName: string;
    state: PrivateGalleryState;
    password: string;
    url: string;
    blogId: string;
    visits: number;
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
    place: string;
    date: string;
    bride: string;
    groom: string;
    lastName: string;
    state: PrivateGalleryState;
    password: string;
    directPath: string;
    blog?: number;
}

export type CreateGalleryError = "ErrorOccuredWhileCreatingGallery";
export type CreateGalleryResult = Result<CreateGalleryError>;

export type EditGalleryError = "ErrorOccuredWhileEditingGallery";
export type EditGalleryResult = Result<EditGalleryError>;

export type DeleteGalleryError = "ErrorOccuredWhileDeletingGallery";
export type DeleteGalleryResult = Result<DeleteGalleryError>;

const getGalleriesListRoute = "/api/panel/galleries-list";
export const getGalleriesList = () =>
    fetch("http://192.168.56.102:8080" + getGalleriesListRoute).then(resp => resp.json() as Promise<GalleryDto[]>);
getGalleriesList.route = getGalleriesListRoute;

const getGalleryVisitsRoute = "/api/panel/gallery-stats/:start/:end/:galleryId";
export const getGalleryVisits = (
    startDate: Date,
    endDate: Date,
    selectedGallery: number
): Promise<GalleryVisitsDto> =>
    fetch(
        "http://192.168.56.102:8080" +
            getGalleryVisitsRoute
                .replace(":start", getDateString(startDate))
                .replace(":end", getDateString(endDate))
                .replace(":galleryId", selectedGallery.toString())
    ).then(resp => resp.json());
getGalleryVisits.route = getGalleryVisitsRoute;

const checkPasswordIsUniqueRoute = "/api/panel/gallery-password-unique/:password/:galleryId?";
export const checkPasswordIsUnique = (galleryId?: number) => (password: string): Promise<boolean> =>
    fetch("http://192.168.56.102:8080" + checkPasswordIsUniqueRoute.replace(":password", password).replace(":galleryId?", galleryId?.toString() ?? "")).then(resp =>
        resp.json()
    );
checkPasswordIsUnique.route = checkPasswordIsUniqueRoute;

const createGalleryRoute = "/api/panel/create-gallery";
export const createGallery = (gallery: GalleryEditDto) =>
    new Promise<CreateGalleryResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + createGalleryRoute, {
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
    fetch("http://192.168.56.102:8080" + getGalleryForEditRoute.replace(":galleryId", id.toString())).then(
        resp => resp.json() as Promise<GalleryEditDto>
    );
getGalleryForEdit.route = getGalleryForEditRoute;

const editGalleryRoute = "/api/panel/edit-gallery";
export const editGallery = (id: number, gallery: GalleryEditDto) =>
    new Promise<EditGalleryResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + editGalleryRoute, {
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
        fetch("http://192.168.56.102:8080" + deleteGalleryRoute, {
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
