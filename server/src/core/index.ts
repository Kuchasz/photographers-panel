import sharp from "sharp";
import { readFileSync, unlinkSync } from "fs";
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
            .resize({ width: 900 })
            .composite([{ input: readFileSync(resolve(__dirname, "logo-watermark.png")), gravity: "southwest" }])
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
