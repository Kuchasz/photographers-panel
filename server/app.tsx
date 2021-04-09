import express from 'express';
import compression from 'compression';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { resolve } from 'path';

require('dotenv').config({ path: resolve(__dirname + '/../.env') });
const upload = multer();

import * as blogModel from './src/models/blog';
import * as siteModel from './src/models/site';
import { All as Root } from '@pp/site';
import fs from 'fs';
import { routes } from '@pp/api/site/routes';
import * as privateGallery from '@pp/api/site/private-gallery';
import * as offer from '@pp/api/site/offer';
import * as authPanel from '@pp/api/panel/auth';
import { setEndpoint } from '@pp/api/common';
import { allowCrossDomain } from './src/core';
import { runPhotoGalleryServer } from '@pp/gallery-server';
import * as config from './src/config';
import { router as siteRouter } from './src/areas/site/routes';
import { router as panelRouter } from './src/areas/panel/routes';

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

setEndpoint(config.app.appPath);

require('isomorphic-fetch');
const Youch = require('youch');

import { migrations } from './src/migrations';
import { connection } from './src/db';
import Knex from 'knex';

const runMigration = (migration: (connection: Knex) => Promise<boolean>, connection: Knex) =>
    new Promise<boolean>(async (res, rej) => {
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
            console.log('----------------------');
            console.log(`Running Migration ${i + 1}`);
            const runOrNot = await runMigration(migrations[i], connection);
            console.log(runOrNot ? 'done' : 'skipped');
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
        res.writeHead(500, { 'content-type': 'text/html' });
        res.write(html);
        res.end();
    });
};

app.use(express.static(requireModule('@pp/site/dist'), { index: false }));
app.use(
    [privateGallery.viewGallery.route],
    express.static(requireModule('@pp/gallery/dist'), { index: false })
);
app.use(
    [authPanel.viewLogIn.route, '/panel*', '/panel/*'],
    express.static(requireModule('@pp/panel/dist'), { index: false })
);

app.use(siteRouter);
app.use(panelRouter);

app.use('/public', express.static('public', { index: false }));

app.get('/sitemap.txt', async (req, res) => {
    const blogAliases = await blogModel.getAliases();
    const protocol = getProtocol(req);

    const blogsUrls = blogAliases.map((alias) => `${protocol}://${req.headers.host}/blog/${alias}`);
    const offersUrls = (await offer.getOffersAliases()).map(
        (alias) => `${protocol}://${req.headers.host}/oferta/${alias}`
    );
    const routesUrls = Object.values(routes)
        .filter((x) => !x.route.includes(':'))
        .map((r) => `${protocol}://${req.headers.host}${r.route}`);

    const urls = blogsUrls.concat(routesUrls).concat(offersUrls);

    res.type('text/plain');
    res.send(urls.join('\r\n'));
});

function getProtocol(req) {
    var proto = req.connection.encrypted ? 'https' : 'http';
    // only do this if you trust the proxy
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0];
}

app.get('/robots.txt', function (req, res) {
    const protocol = getProtocol(req);
    const sitemapUrl = `${protocol}://${req.headers.host}/sitemap.txt`;
    res.type('text/plain');
    res.send(`user-agent: *\nallow: /\n\nsitemap: ${sitemapUrl}`);
});

app.get('*', async (req, res, next) => {
    if (req.url === '/api') return next();

    if (req.url.includes('/public')) return res.sendStatus(404);

    let desiredRoute: { route: string };
    let initialState: any;

    const serverConfig = {
        stats: {
            siteId: config.stats.siteId,
            urlBase: config.stats.urlBase,
        },
    };

    console.log(req.url);

    try {
        const found = Object.values(routes).filter((p) => Root.matchPath(req.path, { path: p.route, exact: true }))[0];
        const match = Root.matchPath(req.path, { path: found.route });

        desiredRoute = { route: found.route };
        initialState = found ? await found.getData(match ? (match.params as any).alias : null) : undefined;

        console.log(match);
    } catch (err) {
        console.error(err);
        return res.redirect('/');
    }

    fs.readFile(requireModule('@pp/site/dist/index.html'), 'utf8', async (err, template) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        let siteContent = '';
        const context = {};
        let helmet: any = {};

        Root.initializeConfig(serverConfig);

        const app = Root.createElement(
            Root.StaticRouter,
            { location: req.url, context },
            Root.createElement(Root.Root, { initialState: { [desiredRoute.route]: initialState } }, null)
        );

        try {
            (global as any).window = {
                location: req.protocol + '://' + req.get('host') + req.originalUrl,
            };
            siteContent = Root.renderToString(app);
            helmet = Root.renderStatic();
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        const address = (req.header('x-forwarded-for') || req.connection.remoteAddress)
            .replace('::ffff:', '')
            .split(',')[0];

        await siteModel.registerVisit(new Date(), address);

        return res.send(`
            <!DOCTYPE html>
            <html lang="pl">
                <head>
                    ${helmet.title.toString()}
                    ${helmet.meta.toString()}
                    <meta charset="UTF-8" />
                    <meta property="og:locale" content="pl_PL">
                    <meta property="og:site_name" content="PyszStudio">
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link href="/main.css" rel="stylesheet" />
                    <script type="text/javascript">
                        window.___InitialState___=${JSON.stringify({
                            [desiredRoute.route]: initialState,
                        })};
                        window.___ServerConfig___=${JSON.stringify(serverConfig)}</script>
                </head>
                <body>
                    <div id="root">${siteContent}</div>
                    <script type="text/javascript" src="/bundle.js"></script>
                </body>
            </html>`);
    });
});

const runApp = async () => {
    await runMigrations();
    await runPhotoGalleryServer(app, resolve(__dirname + '/databases'));
    app.listen(8080, () => {
        console.log('Application started...');
    });
};

runApp();
