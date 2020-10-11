import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/site/private-gallery";
import { getDateString, getDateRange } from "../../../utils/date";
import { GalleryEditDto, GalleryDto, GalleryVisitsDto, VisitsSummaryDto } from "../../../api/panel/private-gallery";
import { PrivateGalleryState } from "../../../api/private-gallery";
import { sum } from "../../../utils/array";
import { RowDataPacket } from "mysql2";

export const getUrl = (password: string): Promise<PrivateGalleryUrlCheckResult> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT p.id, p.state, p.bride, p.groom, p.place, p.lastname, p.dir, p.date, be.title, be.alias FROM PrivateGallery AS p 
        LEFT OUTER JOIN Blog be ON be.id = p.Blog_id
        WHERE p.pass = ?
        `,
            [password],
            (_err, [gallery]: RowDataPacket[], _fields) => {
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
        connection.query(`SELECT id FROM PrivateGallery AS p WHERE p.id = ?`, [id], (_err, rows: RowDataPacket[], _fields) => {
            resolve(rows.length !== 0);
        })
    );

export const getList = (): Promise<GalleryDto[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.id, p.date, p.place, p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id, SUM(d.count) as visits 
            FROM PrivateGallery p
            LEFT JOIN PrivateGalleryDailyVisit d ON p.id = d.PrivateGallery_id
            GROUP BY p.id
            ORDER BY p.date DESC`,
            (_err, galleries, _fields) => {
                const galleryListItems = galleries.map((g: any) => ({
                    id: g.id,
                    date: getDateString(new Date(g.date)),
                    place: g.place,
                    bride: g.bride,
                    groom: g.groom,
                    lastName: g.lastname,
                    state: Number(g.state),
                    password: g.pass,
                    url: g.dir,
                    blogId: Number(g.Blog_id),
                    visits: g.visits ? Number(g.visits) : 0
                }));

                resolve(galleryListItems);
            }
        );
    });

export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GalleryVisitsDto> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    const dailyVisits = await new Promise<VisitsSummaryDto[]>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ? AND d.date BETWEEN ? AND ?`,
            [galleryId, getDateString(startDate), getDateString(endDate)],
            (_err, visists: any[], _fields) => {
                const dayVisits = visists.reduce(
                    (prv, cur) => ({ [getDateString(cur.date)]: Number.parseInt(cur.count), ...prv }),
                    {}
                );
                const dailies = days.map(getDateString).map((x) => ({ date: x, visits: dayVisits[x] ?? 0 }));

                resolve(dailies);
            }
        );
    });

    const bestDay = await new Promise<VisitsSummaryDto>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ?
            ORDER BY d.count DESC
            LIMIT 1`,
            [galleryId],
            (_err, visits: RowDataPacket[], _fields) => {
                if (visits && visits.length > 0) {
                    const [visit] = visits;
                    resolve({ date: getDateString(visit.date), visits: visit.count });
                }
                resolve({ date: "", visits: 0 });
            }
        );
    });

    const totalVisits = await new Promise<number>((resolve, reject) => {
        connection.query(
            `SELECT SUM(d.count) as visits FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ?
            GROUP BY d.PrivateGallery_id`,
            [galleryId],
            (_err, result: RowDataPacket[], _fields) => {
                if (result && result.length > 0) {
                    const [visit] = result;
                    resolve(visit.visits);
                }
                resolve(0);
            }
        );
    });

    const emails = await new Promise<number>((resolve, reject) => {
        connection.query(
            `SELECT COUNT(d.id) as emails FROM PrivateGalleryEmail d WHERE d.PrivateGallery_id = ?
            GROUP BY d.PrivateGallery_id`,
            [galleryId],
            (_err, result: RowDataPacket[], _fields) => {
                if (result && result.length > 0) {
                    const [email] = result;
                    resolve(email.emails);
                }
                resolve(0);
            }
        );
    });

    const todayVisits = await new Promise<number>((resolve, reject) => {
        connection.query(
            `SELECT d.count FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ? AND date = ?`,
            [galleryId, today],
            (_err, result: RowDataPacket[], _fields) => {
                if (result && result.length > 0) {
                    const [daily] = result;
                    resolve(daily.count);
                }
                resolve(0);
            }
        );
    });

    const rangeVisits = sum(dailyVisits, (d) => d.visits);

    return {
        bestDay,
        dailyVisits,
        totalVisits,
        rangeDays: days.length,
        rangeVisits,
        emails,
        todayVisits
    };
};

export const checkPasswordIsUnique = (password: string, galleryId?: number): Promise<boolean> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.id 
            FROM PrivateGallery p
            WHERE p.pass = ?`,
            [password],
            (_err, galleries: RowDataPacket[], _fields) => {
                const [gallery] = galleries;
                if (!gallery) {
                    resolve(true);
                } else {
                    resolve(gallery.id === galleryId);
                }
            }
        );
    });

export const getForEdit = (galleryId: number): Promise<GalleryEditDto> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.place, p.date,  p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id
            FROM PrivateGallery p
            WHERE p.id = ?`,
            [galleryId],
            (_err, [gallery]: RowDataPacket[], _fields) => {
                resolve({
                    place: gallery.place,
                    date: getDateString(gallery.date),
                    bride: gallery.bride,
                    groom: gallery.groom,
                    lastName: gallery.lastname,
                    state: Number(gallery.state),
                    password: gallery.pass,
                    directPath: gallery.dir,
                    blog: Number(gallery.Blog_id)
                });
            }
        );
    });

export const createGallery = (gallery: GalleryEditDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `INSERT INTO PrivateGallery(
                    date, 
                    place, 
                    bride, 
                    groom, 
                    lastname, 
                    state, 
                    pass, 
                    dir, 
                    Blog_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    gallery.date,
                    gallery.place,
                    gallery.bride,
                    gallery.groom,
                    gallery.lastName,
                    gallery.state,
                    gallery.password,
                    gallery.directPath,
                    gallery.blog
                ],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const editGallery = (id: number, gallery: GalleryEditDto) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `UPDATE PrivateGallery
                SET
                    date = ?, 
                    place = ?, 
                    bride = ?, 
                    groom = ?, 
                    lastname = ?, 
                    state = ?, 
                    pass = ?, 
                    dir = ?, 
                    Blog_id = ?
                WHERE id = ?`,
                [
                    gallery.date,
                    gallery.place,
                    gallery.bride,
                    gallery.groom,
                    gallery.lastName,
                    gallery.state,
                    gallery.password,
                    gallery.directPath,
                    gallery.blog,
                    id
                ],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const deleteGallery = (id: number) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `DELETE FROM PrivateGallery
                WHERE id = ?;
                
                DELETE FROM PrivateGalleryEmail
                WHERE PrivateGallery_id = ?;
                
                DELETE FROM PrivateGalleryDailyVisit
                WHERE PrivateGallery_id = ?;`,
                [id, id, id],
                (err, _, _fields) => {
                    if (err) {
                        connection.rollback();
                    } else {
                        connection.commit();
                    }

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });
