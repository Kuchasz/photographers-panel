import express from "express";
import { runPhotoGalleryServer } from "./index";
import "reflect-metadata";

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const runApp = async () => {
    await runPhotoGalleryServer(app, __dirname);

    app.listen(8080, () => {
        console.log('Application server started...');
    });
};

runApp();