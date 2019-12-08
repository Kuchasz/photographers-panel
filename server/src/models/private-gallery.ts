import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/private-gallery";
import { getDateString } from "../../../utils/date";

export const getUrl = (password: string): Promise<PrivateGalleryUrlCheckResult> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT p.id, p.state, p.bride, p.groom, p.place, p.lastname, p.dir, p.date, be.title, be.alias FROM privategallery AS p 
        LEFT OUTER JOIN blogentry be ON be.id = p.BlogEntryId
        WHERE p.pass = '${password}'
        `,
            (_err, [gallery], _fields) => {
                const result: PrivateGalleryUrlCheckResult =
                    gallery == undefined
                        ? { gallery, blog: undefined }
                        : {
                              gallery: {
                                  id: gallery.id,
                                  state: gallery.state,
                                  bride: gallery.bride,
                                  groom: gallery.groom,
                                  place: gallery.place,
                                  lastName: gallery.lastname,
                                  url: gallery.dir,
                                  date: getDateString(new Date(gallery.date))
                              },
                              blog:
                                  gallery.title == undefined
                                      ? undefined
                                      : { title: gallery.title, alias: gallery.alias }
                          };

                resolve(result);
            }
        );
    });

export const exists = (id: number): Promise<boolean> =>
    new Promise((resolve, reject) =>
        connection.query(`SELECT id FROM privategallery AS p WHERE p.id = ${id}`, (_err, rows, _fields) => {
            resolve(rows.length !== 0);
        })
    );
