import * as emailModel from "../../models/email";
import * as fs from "fs";
import * as privateGallery from "@pp/api/dist/site/private-gallery";
import * as privateGalleryModel from "../../models/private-gallery";
import { requireModule } from "../../core/dependencies";
import { ResultType } from "@pp/api/dist/common";
import { routes } from "@pp/api/dist/site/routes";

export const subscribeForNotification = async (req: any, res: any) => {
    let result: privateGallery.SubscribtionResult | undefined = undefined;

    var emailIsValid = emailModel.validate(req.body.email);
    if (!emailIsValid) result = { type: ResultType.Error, error: 'EmailInvalid' };

    const galleryExists = await privateGalleryModel.exists(req.body.privateGalleryId);
    if (galleryExists === false) result = { type: ResultType.Error, error: 'GalleryDoesNotExists' };

    const subscribtionExists = await privateGalleryModel.alreadySubscribed(req.body);
    if (subscribtionExists === true) result = { type: ResultType.Error, error: 'AlreadySubscribed' };

    if (result == undefined) {
        await privateGalleryModel.subscribe(req.body);
        result = { type: ResultType.Success };
    }

    res.json(result);
};

export const getGalleryUrl = async (req: any, res: any) => {
    const gallery = await privateGalleryModel.getUrl(req.params.password);

    res.json(gallery);
};

export const postViewGallery = async (req: any, res: any) => {
    const { galleryUrl, galleryId } = req.body;
    const initialState = {
        galleryId: Number(galleryId),
        galleryUrl: galleryUrl + '/',
    };

    const address = (req.header('x-forwarded-for') || req.connection.remoteAddress)
        .replace('::ffff:', '')
        .split(',')[0];
    await privateGalleryModel.registerVisit(galleryId, address, new Date());

    fs.readFile(requireModule('@pp/gallery/dist/index.html'), 'utf8', (err, template) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        return res.send(
            template.replace(
                `<div id="state-initializer">{initial_state}</div>`,
                `<script type="text/javascript">window.___InitialState___=${JSON.stringify(initialState)}</script>`
            )
        );
    });
};

export const getViewGallery = async (req: any, res: any) => {
    res.redirect(routes.private.route);
};
