import { connection } from "../db";
import { PrivateGalleryUrlCheckResult } from "../../../api/site/private-gallery";
import { getDateString, getDateRange } from "../../../utils/date";
import { GalleryEditDto, GalleryDto, GalleryVisitsDto, VisitsSummaryDto } from "../../../api/panel/private-gallery";
import { PrivateGalleryState } from "../../../api/private-gallery";
import { sum } from "../../../utils/array";

export const getUrl = async (password: string): Promise<PrivateGalleryUrlCheckResult> => {
    // const [[gallery]] = await connection.raw(`
    //         SELECT p.id, p.state, p.bride, p.groom, p.place, p.lastname, p.dir, p.date, be.title, be.alias FROM PrivateGallery AS p 
    //         LEFT OUTER JOIN Blog be ON be.id = p.Blog_id
    //         WHERE p.pass = ?`,
    //     [password]);

    const [gallery] = await connection("PrivateGallery")
        .leftOuterJoin("Blog", "Blog.Id", "PrivateGallery.Blog_id")
        .where({ Password: password })
        .select(
            "PrivateGallery.Id",
            "PrivateGallery.State",
            "PrivateGallery.Bride",
            "PrivateGallery.Groom",
            "PrivateGallery.Place",
            "PrivateGallery.LastName",
            "PrivateGallery.DirectPath",
            "PrivateGallery.Date",
            "Blog.Title",
            "Blog.Alias");

    return gallery == undefined
        ? { gallery: gallery as any, blog: undefined }
        : {
            gallery: {
                id: gallery.Id,
                state: gallery.State,
                bride: gallery.Bride,
                groom: gallery.Groom,
                place: gallery.Place,
                lastName: gallery.LastName,
                url: gallery.DirectPath,
                date: getDateString(new Date(gallery.Date))
            },
            blog: gallery.Title == undefined
                ? undefined
                : { title: gallery.Title, alias: gallery.Alias }
        };
}

export const exists = async (id: number): Promise<boolean> => {
    // const [rows] = await connection.raw(`SELECT id FROM PrivateGallery AS p WHERE p.id = ?`, [id]);
    const rows = await connection("PrivateGallery")
        .where({ Id: id })
        .select("Id")
        .limit(1);

    return rows.length !== 0;
}

export const getList = async (): Promise<GalleryDto[]> => {
    // const [galleries] = await connection.raw(`
    //         SELECT p.id, p.date, p.place, p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id, SUM(d.count) as visits 
    //         FROM PrivateGallery p
    //         LEFT JOIN PrivateGalleryVisit d ON p.id = d.PrivateGallery_id
    //         GROUP BY p.id
    //         ORDER BY p.date DESC`);

    const galleries = await connection("PrivateGallery")
        .leftJoin("PrivateGalleryVisit", "PrivateGalleryVisit.PrivateGallery_id", "PrivateGallery.Id")
        .groupBy("PrivateGallery.Id")
        .orderBy("PrivateGallery.Date", "desc")
        .select(
            "PrivateGallery.Id",
            "PrivateGallery.Date",
            "PrivateGallery.Place",
            "PrivateGallery.Bride",
            "PrivateGallery.Groom",
            "PrivateGallery.LastName",
            "PrivateGallery.State",
            "PrivateGallery.Password",
            "PrivateGallery.DirectPath",
            "PrivateGallery.Blog_id",
            connection.raw(`COUNT("PrivateGallery"."Id") AS "Visits"`));

    return galleries.map((g: any) => ({
        id: g.Id,
        date: getDateString(new Date(g.Date)),
        place: g.Place,
        bride: g.Bride,
        groom: g.Groom,
        lastName: g.LastName,
        state: Number(g.State),
        password: g.Password,
        url: g.DirectPath,
        blogId: g.Blog_id ? Number(g.Blog_id) : undefined,
        visits: g.Visits ? Number(g.Visits) : 0
    }));
}

export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GalleryVisitsDto> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    // const [visists] = await connection.raw(`
    //         SELECT d.count, d.date FROM PrivateGalleryVisit d WHERE d.PrivateGallery_id = ? AND d.date BETWEEN ? AND ?`,
    //     [galleryId, getDateString(startDate), getDateString(endDate)]);

    const visits = await connection("PrivateGalleryVisit")
        .where({ PrivateGallery_id: galleryId })
        .whereBetween("Date", [getDateString(startDate), getDateString(endDate)])
        .groupBy("Date")
        .select("Date", connection.raw(`COUNT("Date") as "Count"`));

    const dayVisits = visits.reduce(
        (prv, cur) => ({ [getDateString(cur.Date)]: Number.parseInt(cur.Count), ...prv }),
        {}
    );

    const dailyVisits = days.map(getDateString).map((x) => ({ date: x, visits: dayVisits[x] ?? 0 }));

    // const [bestDayVisits] = await connection.raw(`
    //         SELECT d.count, d.date FROM PrivateGalleryVisit d WHERE d.PrivateGallery_id = ?
    //         ORDER BY d.count DESC
    //         LIMIT 1`,
    //     [galleryId]);

    const bestDayVisits = await connection("PrivateGalleryVisit")
        .select("Date", connection.raw(`COUNT("Date") as "Count"`))
        .groupBy("Date")
        .where({ PrivateGallery_id: galleryId })
        .orderBy("Count", "desc")
        .limit(1);

    const bestDay = (bestDayVisits && bestDayVisits.length > 0)
        ? { date: getDateString(bestDayVisits[0].Date), visits: bestDayVisits[0].Count }
        : { date: "", visits: 0 };

    // const [totalVisitsResult] = await connection.raw(`
    //         SELECT SUM(d.count) as visits FROM PrivateGalleryVisit d WHERE d.PrivateGallery_id = ?
    //         GROUP BY d.PrivateGallery_id`,
    //     [galleryId]);

    const totalVisitsResult = await connection("PrivateGalleryVisit")
        .where({ PrivateGallery_id: galleryId })
        .count("Id", { as: 'Visits' })
        .first();

    const totalVisits = (totalVisitsResult)
        ? totalVisitsResult.Visits as number
        : 0;

    // const [emailsResult] = await connection.raw(`
    //         SELECT COUNT(d.id) as emails FROM PrivateGalleryEmail d WHERE d.PrivateGallery_id = ?
    //         GROUP BY d.PrivateGallery_id`,
    //     [galleryId]);

    const emailsResult = await connection("PrivateGalleryEmail")
        .count("Id", { as: 'Emails' })
        .where({ PrivateGallery_id: galleryId });

    const emails = (emailsResult && emailsResult.length > 0)
        ? emailsResult[0].Emails as number
        : 0;

    // const [todayVisitsResult] = await connection.raw(`
    //         SELECT d.count FROM PrivateGalleryVisit d WHERE d.PrivateGallery_id = ? AND date = ?`,
    //     [galleryId, today]);

    const todayVisitsResult = await connection("PrivateGalleryVisit")
        .count("Id", { as: 'Count' })
        .where({ PrivateGallery_id: galleryId, Date: today })
        .first();

    const todayVisits = todayVisitsResult
        ? todayVisitsResult.Count as number
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
    // const [galleries] = await connection.raw(`
    //         SELECT p.id 
    //         FROM PrivateGallery p
    //         WHERE p.pass = ?`,
    //     [password]);

    const gallery = await connection("PrivateGallery")
        .where({ Password: password })
        .select("Id")
        .first();

    return !gallery || gallery.Id === galleryId;
}

export const getForEdit = async (galleryId: number): Promise<GalleryEditDto> => {
    // const [[gallery]] = await connection.raw(`
    //         SELECT p.place, p.date,  p.bride, p.groom, p.lastname, p.state, p.pass, p.dir, p.Blog_id
    //         FROM PrivateGallery p
    //         WHERE p.id = ?`,
    //     [galleryId]);

    const [gallery] = await connection("PrivateGallery")
        .select("Place", "Date", "Bride", "Groom", "LastName", "State", "Password", "DirectPath", "Blog_id")
        .where({ Id: galleryId })
        .limit(1);

    return ({
        place: gallery.Place,
        date: getDateString(gallery.Date),
        bride: gallery.Bride,
        groom: gallery.Groom,
        lastName: gallery.LastName,
        state: Number(gallery.State),
        password: gallery.Password,
        directPath: gallery.DirectPath,
        blog: Number(gallery.Blog_id)
    });
}

export const createGallery = async (gallery: GalleryEditDto) => {
    try {
        // await connection.raw(
        //     `INSERT INTO PrivateGallery(
        //         date, 
        //         place, 
        //         bride, 
        //         groom, 
        //         lastname, 
        //         state, 
        //         pass, 
        //         dir, 
        //         Blog_id) 
        //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        //     [
        //         gallery.date,
        //         gallery.place,
        //         gallery.bride,
        //         gallery.groom,
        //         gallery.lastName,
        //         gallery.state,
        //         gallery.password,
        //         gallery.directPath,
        //         gallery.blog
        //     ]);

        await connection("PrivateGallery")
            .insert({
                Date: gallery.date,
                Place: gallery.place,
                Bride: gallery.bride,
                Groom: gallery.groom,
                LastName: gallery.lastName,
                State: gallery.state,
                Password: gallery.password,
                DirectPath: gallery.directPath,
                Blog_id: gallery.blog
            });
    } catch (err) {
        return Promise.reject();
    }
}

export const editGallery = async (id: number, gallery: GalleryEditDto) => {
    try {
        // await connection.raw(
        //     `UPDATE PrivateGallery
        //     SET
        //         date = ?, 
        //         place = ?, 
        //         bride = ?, 
        //         groom = ?, 
        //         lastname = ?, 
        //         state = ?, 
        //         pass = ?, 
        //         dir = ?, 
        //         Blog_id = ?
        //     WHERE id = ?`,
        //     [
        //         gallery.date,
        //         gallery.place,
        //         gallery.bride,
        //         gallery.groom,
        //         gallery.lastName,
        //         gallery.state,
        //         gallery.password,
        //         gallery.directPath,
        //         gallery.blog,
        //         id
        //     ]);

        await connection("PrivateGallery")
            .update({
                Date: gallery.date,
                Place: gallery.place,
                Bride: gallery.bride,
                Groom: gallery.groom,
                LastName: gallery.lastName,
                State: gallery.state,
                Password: gallery.password,
                DirectPath: gallery.directPath,
                Blog_id: gallery.blog
            })
            .where({ Id: id });

    } catch (err) {
        return Promise.reject();
    }
}

export const deleteGallery = async (id: number) => {
    const transaction = await connection.transaction();
    try {
        // await transaction.raw(
        //     `DELETE FROM PrivateGallery
        //     WHERE id = ?;

        //     DELETE FROM PrivateGalleryEmail
        //     WHERE PrivateGallery_id = ?;

        //     DELETE FROM PrivateGalleryVisit
        //     WHERE PrivateGallery_id = ?;`,
        //     [id, id, id]);

        await transaction("PrivateGallery")
            .delete()
            .where({ Id: id });
        await transaction("PrivateGalleryEmail")
            .delete()
            .where({ PrivateGallery_id: id });
        await transaction("PrivateGalleryVisit")
            .delete()
            .where({ PrivateGallery_id: id });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        return Promise.reject(err);
    }
}
