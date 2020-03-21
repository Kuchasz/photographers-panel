import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/site/private-gallery";
import { getDateString, getDateRange } from "../../../utils/date";
import { Gallery, GetGalleryVisitsResult, VisitsSummary } from "../../../api/panel/private-gallery";
import { PrivateGalleryState } from "../../../api/private-gallery";
import { sum } from "../../../utils/array";

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

export const getList = (): Promise<Gallery[]> =>
    new Promise((resolve, reject) => {
        connection.query(`
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

// export interface VisitsSummary {
//     date: string;
//     visits: string;
// }

// bestDay: VisitsSummary;
// dailyVisits: VisitsSummary[];
// sumOfVisits: number;
// rangeSumOfVisits?: number;
export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GetGalleryVisitsResult> => {
    const dailies = await new Promise<VisitsSummary[]>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date FROM daily d WHERE d.PrivateGalleryId = '${galleryId}' AND d.date BETWEEN '${getDateString(startDate)}' AND '${getDateString(endDate)}'`,
            (_err, visists: any[], _fields) => {
                const dayVisits = visists.reduce((prv, cur) => ({ [getDateString(cur.date)]: Number.parseInt(cur.count), ...prv }), {});
                const dailies = getDateRange(startDate, endDate).map(getDateString).map(x => ({ date: x, visits: dayVisits[x] ?? 0 }));

                resolve(dailies);
            }
        );
    });

    const bestDay = await new Promise<VisitsSummary>((resolve, reject) => {
        connection.query(
            `SELECT d.count, d.date, FROM daily d WHERE d.PrivateGalleryId = '${galleryId}'`,
            (_err, visits, _fields) => {
                if (visits) {
                    const [visit] = visits;
                    resolve({ date: visit.date, visits: visit.count });
                }
                resolve(undefined);
            }
        );
    });

    const sumOfVisits = await new Promise<number>((resolve, reject) => {
        connection.query(
            `SELECT SUM(d.count) as [visits] FROM daily d WHERE d.PrivateGalleryId = '${galleryId}'`,
            (_err, result, _fields) => {
                if (result) {
                    const [visit] = result;
                    resolve(visit.visits);
                }
                resolve(0);
            }
        );
    });

    const rangeSumOfVisits = sum(dailies, d => d.visits);

    return {
        bestDay: bestDay,
        dailyVisits: dailies,
        sumOfVisits,
        rangeSumOfVisits
    };
};
