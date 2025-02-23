import * as emailModel from "../../models/email";
import * as fs from "fs";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import * as privateGalleryModel from "../../models/private-gallery";
import { resolveModulePath } from "../../core/dependencies";
import { ResultType } from "@pp/api/dist/common";
import { routes } from "@pp/api/dist/site/routes";
import { Request } from "express";

export const subscribeForNotification = async (data: privateGallery.Subscription): Promise<privateGallery.SubscribtionResult> => {
    const emailIsValid = emailModel.validate(data.email);
    if (!emailIsValid) return { type: ResultType.Error, error: 'EmailInvalid' };

    const galleryExists = await privateGalleryModel.exists(data.privateGalleryId);
    if (galleryExists === false) return { type: ResultType.Error, error: 'GalleryDoesNotExists' };

    const subscribtionExists = await privateGalleryModel.alreadySubscribed(data);
    if (subscribtionExists === true) return { type: ResultType.Error, error: 'AlreadySubscribed' };

    await privateGalleryModel.subscribe(data);
    return { type: ResultType.Success };
};

export const getGalleryUrl = async (password: string): Promise<privateGallery.PrivateGalleryUrlCheckResult> => {
    return await privateGalleryModel.getUrl(password);
};

export const postViewGallery = async (req: Request): Promise<string> => {
    const { galleryUrl, galleryId } = req.body;
    const initialState = {
        galleryId: Number(galleryId),
        galleryUrl: galleryUrl + '/',
    };

    const address = (req.header('x-forwarded-for') || req.connection.remoteAddress)
        ?.replace('::ffff:', '')
        .split(',')[0] || 'unknown';

    await privateGalleryModel.registerVisit(galleryId, address, new Date());

    return new Promise((resolve, reject) => {
        fs.readFile(resolveModulePath('@pp/gallery', 'dist/index.html'), 'utf8', (err, template) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            resolve(
                template.replace(
                    `<div id="state-initializer">{initial_state}</div>`,
                    `<script type="text/javascript">window.___InitialState___=${JSON.stringify(initialState)}</script>`
                )
            );
        });
    });
};

export const getViewGallery = async (_req: Request): Promise<string> => {
    return routes.private.route;
};
