import * as messages from "../../messages";
import * as privateGallery from "@pp/api/dist/panel/private-gallery";
import * as privateGalleryModel from "../../models/private-gallery";
import { ResultType } from "@pp/api/dist/common";

export const getGalleriesList = async (req: any, res: any) => {
    const galleries = await privateGalleryModel.getList();
    res.json(galleries);
};

export const getGalleryVisits = async (req: any, res: any) => {
    const galleryStats = await privateGalleryModel.getStats(
        Number.parseInt(req.params.galleryId),
        new Date(req.params.start),
        new Date(req.params.end)
    );
    res.json(galleryStats);
};

export const checkPasswordIsUnique = async (req: any, res: any) => {
    const passwordUnique = await privateGalleryModel.checkPasswordIsUnique(
        req.params.password,
        req.params.galleryId ? Number(req.params.galleryId) : undefined
    );
    res.json(passwordUnique);
};

export const getGalleryForEdit = async (req: any, res: any) => {
    const gallery = await privateGalleryModel.getForEdit(Number(req.params.galleryId));
    res.json(gallery);
};

export const getGalleryEmails = async (req: any, res: any) => {
    const gallery = await privateGalleryModel.getEmails(Number(req.params.galleryId));
    res.json(gallery);
};

export const createGallery = async (req: any, res: any) => {
    let result: privateGallery.CreateGalleryResult | undefined = undefined;

    try {
        await privateGalleryModel.createGallery(req.body as privateGallery.GalleryEditDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileCreatingGallery',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const notifySubscribers = async (req: any, res: any) => {
    let result: privateGallery.NotifySubscribersResult | undefined = undefined;

    try {
        const { id }: { id: number } = req.body;
        const emails = await privateGalleryModel.getEmails(id);
        const gallery = await privateGalleryModel.getForEdit(id);

        await messages.notifySubscribers(
            emails.emails.map((e) => e.address),
            gallery.password
        );
        await privateGalleryModel.markAsNotified(id);

        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileNotifyingSubsribers',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const editGallery = async (req: any, res: any) => {
    let result: privateGallery.EditGalleryResult | undefined = undefined;

    try {
        var { id, gallery }: { id: number; gallery: privateGallery.GalleryEditDto } = req.body;
        await privateGalleryModel.editGallery(id, gallery);
        result = { type: ResultType.Success };
    } catch (err) {
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileEditingGallery',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const deleteGallery = async (req: any, res: any) => {
    let result: privateGallery.DeleteGalleryResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        await privateGalleryModel.deleteGallery(id);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileDeletingGallery',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};
