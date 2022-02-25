import * as fs from 'fs';
import { log } from './log';

export const rename = (oldPath: string, newPath: string): Promise<void> =>
    new Promise<void>((res, rej) => {
        fs.rename(oldPath, newPath, (err) => {
            log(`RENAMING PATH: ${oldPath} => ${newPath}`, err);
            if (err) rej(err);
            else res();
        });
    });

export const deleteFile = (imagePath: string): Promise<void> =>
    new Promise((res, rej) => {
        fs.unlinkSync(imagePath);
        res();
    });

export const deleteFolderRecursiveSync = function (path: string) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursiveSync(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

export const deleteFolderRecursive = (imagesPath: string): Promise<void> =>
    new Promise((res, rej) => {
        try {
            deleteFolderRecursiveSync(imagesPath);
            res();
        } catch (err) {
            rej(err);
        }
    });
