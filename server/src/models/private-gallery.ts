import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/site/private-gallery";
import { getDateString, getDateRange } from "../../../utils/date";
import { Gallery, GetGalleryVisitsResult, VisitsSummary, GalleryPayload } from "../../../api/panel/private-gallery";
import { PrivateGalleryState } from "../../../api/private-gallery";
import { sum } from "../../../utils/array";

export const getUrl = (password: string): Promise<PrivateGalleryUrlCheckResult> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
        SELECT p.id, p.state, p.bride, p.groom, p.place, p.lastname, p.dir, p.date, be.title, be.alias FROM privategallery AS p 
        LEFT OUTER JOIN blogentry be ON be.id = p.BlogEntryId
        WHERE p.pass = ?
        `,
            [password],
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
        connection.query(`SELECT id FROM privategallery AS p WHERE p.id = ?`, [id], (_err, rows, _fields) => {
            resolve(rows.length !== 0);
        })
    );

export const getList = (): Promise<Gallery[]> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.id, p.date, p.place, p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.BlogEntryId, SUM(d.count) as visits 
            FROM privategallery p
            LEFT JOIN daily d ON p.id = d.PrivateGalleryId
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
                    blogId: Number(g.BlogEntryId),
                    visits: g.visits ? Number(g.visits) : 0
                }));

                resolve(galleryListItems);
            }
        );
    });

export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GetGalleryVisitsResult> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    const dailyVisits = await new Promise<VisitsSummary[]>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date FROM daily d WHERE d.PrivateGalleryId = ? AND d.date BETWEEN ? AND ?`,
            [galleryId, getDateString(startDate), getDateString(endDate)],
            (_err, visists: any[], _fields) => {
                const dayVisits = visists.reduce(
                    (prv, cur) => ({ [getDateString(cur.date)]: Number.parseInt(cur.count), ...prv }),
                    {}
                );
                const dailies = days.map(getDateString).map(x => ({ date: x, visits: dayVisits[x] ?? 0 }));

                resolve(dailies);
            }
        );
    });

    const bestDay = await new Promise<VisitsSummary>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date FROM daily d WHERE d.PrivateGalleryId = ?
            ORDER BY d.count DESC
            LIMIT 1`,
            [galleryId],
            (_err, visits, _fields) => {
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
            `SELECT SUM(d.count) as visits FROM daily d WHERE d.PrivateGalleryId = ?
            GROUP BY d.PrivateGalleryId`,
            [galleryId],
            (_err, result, _fields) => {
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
            `SELECT COUNT(d.id) as emails FROM email d WHERE d.PrivateGalleryId = ?
            GROUP BY d.PrivateGalleryId`,
            [galleryId],
            (_err, result, _fields) => {
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
            `SELECT d.count FROM daily d WHERE d.PrivateGalleryId = ? AND date = ?`,
            [galleryId, today],
            (_err, result, _fields) => {
                if (result && result.length > 0) {
                    const [daily] = result;
                    resolve(daily.count);
                }
                resolve(0);
            }
        );
    });

    const rangeVisits = sum(dailyVisits, d => d.visits);

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

export const checkPasswordIsUnique = (password: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.id 
            FROM privategallery p
            WHERE p.pass = ?`,
            [password],
            (_err, galleries, _fields) => {
                resolve(galleries.length === 0);
            }
        );
    });

export const getForEdit = (galleryId: number): Promise<GalleryPayload> =>
    new Promise((resolve, reject) => {
        connection.query(
            `
            SELECT p.place, p.date,  p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.BlogEntryId
            FROM privategallery p
            WHERE p.id = ?`,
            [galleryId],
            (_err, [gallery], _fields) => {
                resolve({
                    place: gallery.place,
                    date: getDateString(gallery.date),
                    bride: gallery.bride,
                    groom: gallery.groom,
                    lastName: gallery.lastname,
                    state: Number(gallery.state),
                    password: gallery.pass,
                    directPath: gallery.dir,
                    blog: Number(gallery.BlogEntryId)
                });
            }
        );
    });

export const createGallery = (gallery: GalleryPayload) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `INSERT INTO privategallery(
                    date, 
                    place, 
                    bride, 
                    groom, 
                    lastname, 
                    state, 
                    pass, 
                    dir, 
                    BlogEntryId) 
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
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });

export const editGallery = (id: number, gallery: GalleryPayload) =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(() => {
            connection.query(
                `UPDATE privategallery
                SET
                    date = ?, 
                    place = ?, 
                    bride = ?, 
                    groom = ?, 
                    lastname = ?, 
                    state = ?, 
                    pass = ?, 
                    dir = ?, 
                    BlogEntryId = ?
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
                    if (err) connection.rollback();

                    err == null ? resolve() : reject(err);
                }
            );
        });
    });
