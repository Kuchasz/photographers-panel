import sharp from "sharp";
import { readFileSync } from "fs";
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
            .webp({ quality: 65 })
            .toFile(finalPath, async (_err, _info) => {
                if (_err) rej();
                res();
            });
    });
