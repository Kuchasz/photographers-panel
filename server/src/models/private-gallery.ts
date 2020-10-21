import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/site/private-gallery";
import { getDateString, getDateRange } from "../../../utils/date";
import { GalleryEditDto, GalleryDto, GalleryVisitsDto, VisitsSummaryDto } from "../../../api/panel/private-gallery";
import { PrivateGalleryState } from "../../../api/private-gallery";
import { sum } from "../../../utils/array";
import { RowDataPacket } from "mysql2";

export const getUrl = async (password: string): Promise<PrivateGalleryUrlCheckResult> => {
    const [[gallery]] = await connection.query<RowDataPacket[]>(`
            SELECT p.id, p.state, p.bride, p.groom, p.place, p.lastname, p.dir, p.date, be.title, be.alias FROM PrivateGallery AS p 
            LEFT OUTER JOIN Blog be ON be.id = p.Blog_id
            WHERE p.pass = ?`,
        [password]);

    return gallery == undefined
        ? { gallery: gallery as any, blog: undefined }
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
            blog: gallery.title == undefined
                ? undefined
                : { title: gallery.title, alias: gallery.alias }
        };
}

export const exists = async (id: number): Promise<boolean> => {
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT id FROM PrivateGallery AS p WHERE p.id = ?`, [id]);
    return rows.length !== 0;
}

export const getList = async (): Promise<GalleryDto[]> => {
    const [galleries] = await connection.query<RowDataPacket[]>(`
            SELECT p.id, p.date, p.place, p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id, SUM(d.count) as visits 
            FROM PrivateGallery p
            LEFT JOIN PrivateGalleryDailyVisit d ON p.id = d.PrivateGallery_id
            GROUP BY p.id
            ORDER BY p.date DESC`);

    return galleries.map((g: any) => ({
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
}

export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GalleryVisitsDto> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    const [visists] = await connection.query<RowDataPacket[]>(`
            SELECT d.count, d.date FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ? AND d.date BETWEEN ? AND ?`,
        [galleryId, getDateString(startDate), getDateString(endDate)]);

    const dayVisits = visists.reduce(
        (prv, cur) => ({ [getDateString(cur.date)]: Number.parseInt(cur.count), ...prv }),
        {}
    );

    const dailyVisits = days.map(getDateString).map((x) => ({ date: x, visits: dayVisits[x] ?? 0 }));

    const [bestDayVisits] = await connection.query<RowDataPacket[]>(`
            SELECT d.count, d.date FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ?
            ORDER BY d.count DESC
            LIMIT 1`,
        [galleryId]);

    const bestDay = (bestDayVisits && bestDayVisits.length > 0)
        ? { date: getDateString(bestDayVisits[0].date), visits: bestDayVisits[0].count }
        : { date: "", visits: 0 };

    const [totalVisitsResult] = await connection.query<RowDataPacket[]>(`
            SELECT SUM(d.count) as visits FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ?
            GROUP BY d.PrivateGallery_id`,
        [galleryId]);

    const totalVisits = (totalVisitsResult && totalVisitsResult.length > 0)
        ? totalVisitsResult[0].visits
        : 0;

    const [emailsResult] = await connection.query<RowDataPacket[]>(`
            SELECT COUNT(d.id) as emails FROM PrivateGalleryEmail d WHERE d.PrivateGallery_id = ?
            GROUP BY d.PrivateGallery_id`,
        [galleryId]);

    const emails = (emailsResult && emailsResult.length > 0)
        ? emailsResult[0].emails
        : 0;

    const [todayVisitsResult] = await connection.query<RowDataPacket[]>(`
            SELECT d.count FROM PrivateGalleryDailyVisit d WHERE d.PrivateGallery_id = ? AND date = ?`,
        [galleryId, today]);

    const todayVisits = (todayVisitsResult && todayVisitsResult.length > 0)
        ? todayVisitsResult[0].count
        : 0;

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

export const checkPasswordIsUnique = async (password: string, galleryId?: number): Promise<boolean> => {
    const [galleries] = await connection.query<RowDataPacket[]>(`
            SELECT p.id 
            FROM PrivateGallery p
            WHERE p.pass = ?`,
        [password]);

    const [gallery] = galleries;

    return !gallery
        ? true
        : gallery.id === galleryId
}

export const getForEdit = async (galleryId: number): Promise<GalleryEditDto> => {
    const [[gallery]] = await connection.query<RowDataPacket[]>(`
            SELECT p.place, p.date,  p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id
            FROM PrivateGallery p
            WHERE p.id = ?`,
        [galleryId]);
    return ({
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

export const createGallery = async (gallery: GalleryEditDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(
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
            ]);
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}

export const editGallery = async (id: number, gallery: GalleryEditDto) => {
    try {
        await connection.beginTransaction();
        await connection.query(
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
            ]);
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}

export const deleteGallery = async (id: number) => {
    try {
        await connection.beginTransaction();
        await connection.query(
            `DELETE FROM PrivateGallery
            WHERE id = ?;
            
            DELETE FROM PrivateGalleryEmail
            WHERE PrivateGallery_id = ?;
            
            DELETE FROM PrivateGalleryDailyVisit
            WHERE PrivateGallery_id = ?;`,
            [id, id, id]);
    } catch (err) {
        await connection.rollback();
        return Promise.reject();
    }
}
