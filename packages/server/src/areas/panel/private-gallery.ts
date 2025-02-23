import { ResultType } from "@pp/api/dist/common";
import * as privateGallery from "@pp/api/dist/panel/private-gallery";
import * as fs from "fs";
import { deleteFolderRecursive } from "../../core/fs";
import * as privateGalleryModel from "../../models/private-gallery";
import * as messages from "../../messages";

export const getGalleriesList = async (): Promise<privateGallery.GalleryDto[]> => {
    return await privateGalleryModel.getList();
};

export const getGalleryVisits = async (galleryId: number, startDate: Date, endDate: Date): Promise<privateGallery.GalleryVisitsDto> => {
    return await privateGalleryModel.getStats(galleryId, startDate, endDate);
};

export const checkPasswordIsUnique = async (password: string, galleryId?: number): Promise<boolean> => {
    return await privateGalleryModel.checkPasswordIsUnique(password, galleryId);
};

export const createGallery = async (data: privateGallery.GalleryEditDto): Promise<privateGallery.CreateGalleryResult> => {
    try {
        await privateGalleryModel.createGallery(data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileCreatingGallery',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getGalleryForEdit = async (galleryId: number): Promise<privateGallery.GalleryEditDto> => {
    return await privateGalleryModel.getForEdit(galleryId);
};

export const editGallery = async (id: number, data: privateGallery.GalleryEditDto): Promise<privateGallery.EditGalleryResult> => {
    try {
        await privateGalleryModel.editGallery(id, data);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileEditingGallery',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const deleteGallery = async (id: number): Promise<privateGallery.DeleteGalleryResult> => {
    try {
        await privateGalleryModel.deleteGallery(id);
        const assetsPath = `./assets/private-gallery/${id}`;
        await deleteFolderRecursive(assetsPath);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingGallery',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getGalleryEmails = async (galleryId: number): Promise<privateGallery.GalleryEmailsDto> => {
    return await privateGalleryModel.getEmails(galleryId);
};

export const notifySubscribers = async (id: number): Promise<privateGallery.NotifySubscribersResult> => {
    try {
        const emails = await privateGalleryModel.getEmails(id);
        const gallery = await privateGalleryModel.getForEdit(id);
        await messages.notifySubscribers(emails.emails.map(e => e.address), gallery.password);
        await privateGalleryModel.markAsNotified(id);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileNotifyingSubsribers',
            errorMessage: JSON.stringify(err),
        };
    }
};
