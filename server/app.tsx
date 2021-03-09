import express from "express";
import compression from "compression";
import multer from "multer";
import cookieParser from "cookie-parser";
import { resolve } from "path";

require('dotenv').config({ path: resolve(__dirname + "/../.env") });
const upload = multer();

import * as blogModel from "./src/models/blog";
import * as messageModel from "./src/models/message";
import * as privateGalleryModel from "./src/models/private-gallery";
import * as emailModel from "./src/models/email";
import * as siteModel from "./src/models/site";
import { All as Root } from "@pp/site";
import * as blog from "@pp/api/site/blog";
import * as blogPanel from "@pp/api/panel/blog";
import * as sitePanel from "@pp/api/panel/site";
import fs from "fs";
import { routes } from "@pp/api/site/routes";
import * as message from "@pp/api/site/message";
import * as privateGallery from "@pp/api/site/private-gallery";
import * as privateGalleryPanel from "@pp/api/panel/private-gallery";
import * as authPanel from "@pp/api/panel/auth";
import { ResultType, setEndpoint } from "@pp/api/common";
import { notifySubscribers, sendEmail } from "./src/messages";
import { allowCrossDomain, processImage } from "./src/core";
import { runPhotoGalleryServer } from "@pp/gallery-server";
import * as config from "./src/config";

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

setEndpoint(config.app.appPath);

require("isomorphic-fetch");
const Youch = require("youch");

import { migrations } from "./src/migrations";
import { connection } from "./src/db";
import { login, verify } from "./src/auth";
import { deleteFile, deleteFolderRecursive } from "./src/core/fs";
import Knex from "knex";

const runMigration = (migration: (connection: Knex) => Promise<boolean>, connection: Knex) => new Promise<boolean>(async (res, rej) => {
    const transaction = await connection.transaction();
    try {
        const runOrNot = await migration(transaction);
        await transaction.commit();
        res(runOrNot);
    } catch (err) {
        console.log(err);
        console.log('Rolling back transaction!');
        await transaction.rollback();
        return Promise.reject(err);
    }
});

const runMigrations = async () => {
    console.log(`Running ${migrations.length} migrations`);
    for (let i = 0; i < migrations.length; i++) {
        try {
            console.log("----------------------");
            console.log(`Running Migration ${i + 1}`);
            const runOrNot = await runMigration(migrations[i], connection);
            console.log(runOrNot ? "done" : "skipped");
        } catch (err) {
            console.log('Migrations failed');
            // console.error(err);
        }
    }
};

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(compression());
app.use(cookieParser());
app.use(allowCrossDomain);

const raiseErr = (err: Error, req: any, res: any) => {
    const youch = new Youch(err, req);

    youch.toHTML().then((html: string) => {
        res.writeHead(500, { "content-type": "text/html" });
        res.write(html);
        res.end();
    });
};

const wildCard = (s: string) => `${s}*`;

app.use(express.static(requireModule("@pp/site/dist"), { index: false }));

app.use(privateGallery.viewGallery.route, express.static(requireModule("@pp/gallery/dist"), { index: false }));
app.use([authPanel.viewLogIn.route, '/panel*', '/panel/*'], express.static(requireModule("@pp/panel/dist"), { index: false }));
app.use("/public", express.static("public", { index: false }));

// site related APIs

app.get(blog.getLastBlog.route, async (_req, res) => {
    const blog = await blogModel.getMostRecent();
    res.json(blog);
});

app.get(blog.getBlogsList.route, async (_req, res) => {
    const blogs = await blogModel.getList();
    res.json(blogs);
});

app.get(blog.getBlog.route, async (req, res) => {
    const blog = await blogModel.get(req.params.alias);

    const address = (req.header('x-forwarded-for') || req.connection.remoteAddress).replace("::ffff:", "").split(',')[0];
    await blogModel.registerVisit(blog.id, address, new Date());

    res.json(blog);
});

app.post(message.send.route, async (req, res) => {
    const mesg = req.body as message.Message;

    const error = messageModel.validate(mesg);

    if (error) {
        res.json({ type: ResultType.Error, error });
        return;
    }

    try {
        await sendEmail(mesg.name, mesg.email, mesg.content);
        res.json({ type: ResultType.Success });
    } catch {
        res.json({ type: ResultType.Error, error: "InternalError" });
    }
});

app.post(privateGallery.subscribeForNotification.route, async (req, res) => {
    let result: privateGallery.SubscribtionResult | undefined = undefined;

    var emailIsValid = emailModel.validate(req.body.email);
    if (!emailIsValid) result = { type: ResultType.Error, error: "EmailInvalid" };

    const galleryExists = await privateGalleryModel.exists(req.body.privateGalleryId);
    if (galleryExists === false) result = { type: ResultType.Error, error: "GalleryDoesNotExists" };

    const subscribtionExists = await privateGalleryModel.alreadySubscribed(req.body);
    if (subscribtionExists === true) result = { type: ResultType.Error, error: "AlreadySubscribed" };

    if (result == undefined) {
        await privateGalleryModel.subscribe(req.body);
        result = { type: ResultType.Success };
    }

    res.json(result);
});

app.get(privateGallery.getGalleryUrl.route, async (req, res) => {
    const gallery = await privateGalleryModel.getUrl(req.params.password);

    res.json(gallery);
});

app.post([`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`], async (req, res) => {
    const { galleryUrl, galleryId } = req.body;
    const initialState = { galleryId: Number(galleryId), galleryUrl: galleryUrl + "/" };

    const address = (req.header('x-forwarded-for') || req.connection.remoteAddress).replace("::ffff:", "").split(',')[0];
    await privateGalleryModel.registerVisit(galleryId, address, new Date());

    fs.readFile(requireModule("@pp/gallery/dist/index.html"), "utf8", (err, template) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }

        return res.send(
            template
                .replace(
                    `<div id="state-initializer">{initial_state}</div>`,
                    `<script type="text/javascript">window.___InitialState___=${JSON.stringify(initialState)}</script>`
                )
        );
    });
});

app.get([`${privateGallery.viewGallery.route}`, `${privateGallery.viewGallery.route}/*`], async (req, res) => {
    res.redirect(routes.private.route);
});

// panel related APIs

app.post(authPanel.logIn.route, async (req, res) => {
    let result: authPanel.LogInResult | undefined = undefined;

    try {
        const tokens = await login(req.body as authPanel.UserCredentials);
        result = { type: ResultType.Success, result: { authToken: tokens.encodedToken, refreshToken: tokens.encodedToken, issuedAt: tokens.iat, expireDate: tokens.exp } };
        res.cookie(config.auth.cookieName, result.result.authToken, { httpOnly: true, maxAge: config.auth.maxAge * 1000 }); //secure the cookie!!
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: 'ErrorOccuredWhileLogIn', errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get([`${authPanel.viewLogIn.route}`, `${authPanel.viewLogIn.route}/*`], async (req, res) => {
    // const { galleryUrl, galleryId } = req.body;
    // const initialState = { galleryId: Number(galleryId), galleryUrl: galleryUrl + "/" };

    fs.readFile(requireModule("@pp/panel/dist/index.html"), "utf8", (err, template) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }

        return res.send(
            template
        );
    });
});

app.get(sitePanel.getSiteVisits.route, verify, async (req, res) => {
    const siteStats = await siteModel.getStats(
        new Date(req.params.start),
        new Date(req.params.end)
    );
    res.json(siteStats);
});

app.get(blogPanel.getBlogSelectList.route, verify, async (req, res) => {
    const blogs = await blogModel.getSelectList();
    res.json(blogs);
});

app.get(blogPanel.getBlogsList.route, verify, async (req, res) => {
    const blogs = await blogModel.getListForPanel();
    res.json(blogs);
});

app.post(blogPanel.createBlog.route, verify, async (req, res) => {
    let result: blogPanel.CreateBlogResult | undefined = undefined;

    try {
        await blogModel.createBlog(req.body as blogPanel.BlogEditDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileCreatingBlog", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get(blogPanel.checkAliasIsUnique.route, verify, async (req, res) => {
    const aliasUnique = await blogModel.checkAliasIsUnique(
        req.params.alias,
        req.params.blogId ? Number(req.params.blogId) : undefined
    );
    res.json(aliasUnique);
});

app.post(blogPanel.changeBlogVisibility.route, verify, async (req, res) => {
    let result: blogPanel.ChangeBlogVisibilityResult | undefined = undefined;

    try {
        await blogModel.changeVisibility(req.body as blogPanel.BlogVisibilityDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileChangingBlogVisibility", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(blogPanel.changeMainBlogAsset.route, verify, async (req, res) => {
    let result: blogPanel.ChangeMainBlogAssetResult | undefined = undefined;

    try {
        await blogModel.changeMainAsset(req.body as blogPanel.MainBlogAssetDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileChangingMainBlogAsset", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(blogPanel.editBlog.route, verify, async (req, res) => {
    let result: blogPanel.BlogEditResult | undefined = undefined;

    var { id, blog }: { id: number; blog: blogPanel.BlogEditDto } = req.body;

    try {
        await blogModel.editBlog(id, blog);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileEditingBlog", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get(blogPanel.getBlogForEdit.route, verify, async (req, res) => {
    const blog = await blogModel.getForEdit(Number(req.params.blogId));
    res.json(blog);
});

app.post(blogPanel.deleteBlog.route, verify, async (req, res) => {
    let result: blogPanel.DeleteBlogResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        await blogModel.deleteBlog(id);
        const assetsPath = blogModel.getAssetsPath(id);

        await deleteFolderRecursive(assetsPath);

        result = { type: ResultType.Success };
    } catch (err) {
        result = { type: ResultType.Error, error: "ErrorOccuredWhileDeletingBlog", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(blogPanel.uploadBlogAsset.route, verify, upload.single("asset"), async (req: Express.Request, res) => {
    let result: blogPanel.UploadBlogAssetResult | undefined = undefined;

    const blogId: number = (req as any).body.blogId;

    try {
        const blogTags = await blogModel.getTags(blogId);

        const assetId = blogModel.getAssetId(blogTags);

        const assetsPath = blogModel.getAssetsPath(blogId);

        if (!fs.existsSync(assetsPath)) {
            fs.mkdirSync(assetsPath, { recursive: true });
        }

        const finalPath = blogModel.getAssetPath(assetsPath, assetId);

        await processImage(req.file.buffer)(finalPath);

        const blogAseet = await blogModel.createBlogAsset(blogId, assetId, "");

        result = {
            type: ResultType.Success,
            result: { id: blogAseet.id, isMain: blogAseet.isMain, url: `/${finalPath}` }
        };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileUploadingBlogAsset", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get(blogPanel.getBlogAssets.route, verify, async (req, res) => {
    const blogAssets = await blogModel.getAssetsForBlog(Number(req.params.blogId));
    res.json(blogAssets);
});

app.post(blogPanel.deleteBlogAsset.route, verify, async (req, res) => {
    let result: blogPanel.DeleteBlogAssetResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        const finalPath = await blogModel.getAssetPathById(id);
        await blogModel.deleteBlogAsset(id);
        await deleteFile(finalPath);

        result = { type: ResultType.Success };
    } catch (err) {
        result = { type: ResultType.Error, error: "ErrorOccuredWhileDeletingBlogAsset", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(blogPanel.changeBlogAssetAlt.route, verify, async (req, res) => {
    let result: blogPanel.ChangeBlogAssetAltResult | undefined = undefined;

    var { id, alt }: { id: number; alt: string } = req.body;

    try {
        await blogModel.changeBlogAssetAlt(id, alt);

        result = { type: ResultType.Success };
    } catch (err) {
        result = { type: ResultType.Error, error: "ErrorOccuredWhileChangingBlogAssetError", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get(blogPanel.getBlogVisits.route, verify, async (req, res) => {
    const blogStats = await blogModel.getStats(
        Number.parseInt(req.params.blogId),
        new Date(req.params.start),
        new Date(req.params.end)
    );
    res.json(blogStats);
});

app.get(privateGalleryPanel.getGalleriesList.route, verify, async (req, res) => {
    const galleries = await privateGalleryModel.getList();
    res.json(galleries);
});

app.get(privateGalleryPanel.getGalleryVisits.route, verify, async (req, res) => {
    const galleryStats = await privateGalleryModel.getStats(
        Number.parseInt(req.params.galleryId),
        new Date(req.params.start),
        new Date(req.params.end)
    );
    res.json(galleryStats);
});

app.get(privateGalleryPanel.checkPasswordIsUnique.route, verify, async (req, res) => {
    const passwordUnique = await privateGalleryModel.checkPasswordIsUnique(
        req.params.password,
        req.params.galleryId ? Number(req.params.galleryId) : undefined
    );
    res.json(passwordUnique);
});

app.get(privateGalleryPanel.getGalleryForEdit.route, verify, async (req, res) => {
    const gallery = await privateGalleryModel.getForEdit(Number(req.params.galleryId));
    res.json(gallery);
});

app.get(privateGalleryPanel.getGalleryEmails.route, verify, async (req, res) => {
    const gallery = await privateGalleryModel.getEmails(Number(req.params.galleryId));
    res.json(gallery);
});

app.post(privateGalleryPanel.createGallery.route, verify, async (req, res) => {
    let result: privateGalleryPanel.CreateGalleryResult | undefined = undefined;

    try {
        await privateGalleryModel.createGallery(req.body as privateGalleryPanel.GalleryEditDto);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileCreatingGallery", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(privateGalleryPanel.notifySubscribers.route, verify, async (req, res) => {
    let result: privateGalleryPanel.NotifySubscribersResult | undefined = undefined;

    try {
        var { id }: { id: number } = req.body;
        const emails = await privateGalleryModel.getEmails(id);
        const gallery = await privateGalleryModel.getForEdit(id);

        await notifySubscribers(emails.emails.map(e => e.address), gallery.password);
        await privateGalleryModel.markAsNotified(id);

        result = { type: ResultType.Success };
    } catch (err) {
        result = { type: ResultType.Error, error: "ErrorOccuredWhileNotifyingSubsribers", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(privateGalleryPanel.editGallery.route, verify, async (req, res) => {
    let result: privateGalleryPanel.EditGalleryResult | undefined = undefined;

    try {
        var { id, gallery }: { id: number; gallery: privateGalleryPanel.GalleryEditDto } = req.body;
        await privateGalleryModel.editGallery(id, gallery);
        result = { type: ResultType.Success };
    } catch (err) {
        result = { type: ResultType.Error, error: "ErrorOccuredWhileEditingGallery", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.post(privateGalleryPanel.deleteGallery.route, verify, async (req, res) => {
    let result: privateGalleryPanel.DeleteGalleryResult | undefined = undefined;

    var { id }: { id: number } = req.body;

    try {
        await privateGalleryModel.deleteGallery(id);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = { type: ResultType.Error, error: "ErrorOccuredWhileDeletingGallery", errorMessage: JSON.stringify(err) };
    }

    res.json(result);
});

app.get("/robots.txt", function (req, res) {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /");
});

app.get("*", async (req, res, next) => {
    if (req.url === "/api")
        return next();

    let desiredRoute: { route: string };
    let initialState: any;

    try {
        const found = Object.values(routes).filter((p) => Root.matchPath(req.path, { path: p.route, exact: true }))[0];
        const match = Root.matchPath(req.path, { path: found.route });

        desiredRoute = { route: found.route };
        initialState = found ? await found.getData(match ? (match.params as any).alias : null) : undefined;

        console.log(match);
    } catch (err) {
        console.error(err);
        return res.redirect("/");
    }

    fs.readFile(requireModule("@pp/site/dist/index.html"), "utf8", async (err, template) => {
        if (err) {
            console.error(err);
            return res.status(500);
        }

        let siteContent = "";
        const context = {};

        const app = Root.createElement(
            Root.StaticRouter,
            { location: req.url, context },
            Root.createElement(Root.Root, { initialState: { [desiredRoute.route]: initialState } }, null)
        );

        try {
            (global as any).window = {
                location: req.protocol + '://' + req.get('host') + req.originalUrl
            };
            siteContent = Root.renderToString(app);
        } catch (err) {
            console.error(err);
            return res.status(500);
        }

        const address = (req.header('x-forwarded-for') || req.connection.remoteAddress).replace("::ffff:", "").split(',')[0];

        await siteModel.registerVisit(new Date(), address);

        return res.send(
            template.replace('<div id="root"></div>', `<div id="root">${siteContent}</div>`).replace(
                "{initial_state}",
                `<script type="text/javascript">window.___InitialState___=${JSON.stringify({
                    [desiredRoute.route]: initialState
                })}</script>`
            )
        );
    });
});


const runApp = async () => {

    await runPhotoGalleryServer(app, resolve(__dirname + "/databases"));

    await runMigrations();

    app.listen(8080, () => {
        console.log("Application started...");
    });
};

runApp();