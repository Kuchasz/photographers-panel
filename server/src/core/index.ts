import sharp from "sharp";
import { readFileSync, unlinkSync, rmdir, existsSync, readdirSync, lstatSync, rmdirSync } from "fs";
import { resolve } from "path";

export const allowCrossDomain = function (_req: any, res: any, next: Function) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
};

export const processImage = (image: Buffer) => (finalPath: string): Promise<void> =>
    new Promise((res, rej) => {
        sharp(image)
            .resize({ width: 1000, height: 1000, fit: "inside" })
            .composite([{ input: readFileSync(resolve(__dirname, "logo-watermark.png")), gravity: "southwest" }])
            .webp({quality: 65})
            .toFile(finalPath, async (_err, _info) => {
                if (_err) rej();
                res();
            });
    });

export const deleteImage = (imagePath: string): Promise<void> =>
    new Promise((res, rej) => {
        unlinkSync(imagePath);
        res();
    });

const deleteFolderRecursive = function (path: string) {
    var files = [];
    if (existsSync(path)) {
        files = readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
};

export const deleteImages = (imagesPath: string): Promise<void> =>
    new Promise((res, rej) => {
        try {
            deleteFolderRecursive(imagesPath);
            res();
        } catch (err) {
            rej(err);
        }
    });
