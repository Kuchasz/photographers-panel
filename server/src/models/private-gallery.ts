import { connection } from '../db';
import { PrivateGalleryUrlCheckResult, Subscription } from '@pp/api/site/private-gallery';
import { getDateString, getDateRange } from '@pp/utils/date';
import { GalleryEditDto, GalleryDto, GalleryVisitsDto, GalleryEmailsDto } from '@pp/api/panel/private-gallery';
import { sum } from '@pp/utils/array';

export const getUrl = async (password: string): Promise<PrivateGalleryUrlCheckResult> => {
    const [gallery] = await connection('PrivateGallery')
        .leftOuterJoin('Blog', 'Blog.Id', 'PrivateGallery.Blog_id')
        .where({ Password: password })
        .select(
            'PrivateGallery.Id',
            'PrivateGallery.State',
            'PrivateGallery.Title',
            'PrivateGallery.DirectPath',
            'PrivateGallery.Date',
            connection.raw(`"Blog"."Title" AS "BlogTitle"`),
            'Blog.Alias'
        );

    return gallery == undefined
        ? { gallery: gallery as any, blog: undefined }
        : {
              gallery: {
                  id: gallery.Id,
                  state: gallery.State,
                  title: gallery.Title,
                  url: gallery.DirectPath,
                  date: getDateString(new Date(gallery.Date)),
              },
              blog: gallery.BlogTitle == undefined ? undefined : { title: gallery.BlogTitle, alias: gallery.Alias },
          };
};

export const registerVisit = (galleryId: number, ip: string, date: Date): Promise<any> =>
    connection.raw(
        `
        INSERT INTO "PrivateGalleryVisit" ("Ip", "Date", "PrivateGallery_id") 
        SELECT ?, ?, ?
        WHERE
            NOT EXISTS (
                SELECT "Id" FROM "PrivateGalleryVisit" WHERE "Ip"=? AND "Date"=? AND "PrivateGallery_id"=?
            )`,
        [ip, date, galleryId, ip, date, galleryId]
    );

export const exists = async (id: number): Promise<boolean> => {
    const rows = await connection('PrivateGallery').where({ Id: id }).select('Id').limit(1);

    return rows.length !== 0;
};

export const subscribe = async (subscribtion: Subscription): Promise<void> => {
    try {
        await connection('PrivateGalleryEmail').insert({
            PrivateGallery_id: subscribtion.privateGalleryId,
            Address: subscribtion.email,
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const alreadySubscribed = async (subscribtion: Subscription): Promise<boolean> => {
    const rows = await connection('PrivateGalleryEmail')
        .where({
            PrivateGallery_id: subscribtion.privateGalleryId,
            Address: subscribtion.email,
        })
        .select('PrivateGallery_id')
        .limit(1);

    return rows.length !== 0;
};

export const getList = async (): Promise<GalleryDto[]> => {
    const galleries = await connection('PrivateGallery')
        .leftJoin('PrivateGalleryVisit', 'PrivateGalleryVisit.PrivateGallery_id', 'PrivateGallery.Id')
        .groupBy('PrivateGallery.Id')
        .orderBy('PrivateGallery.Date', 'desc')
        .select(
            'PrivateGallery.Id',
            'PrivateGallery.Date',
            'PrivateGallery.Title',
            'PrivateGallery.Notes',
            'PrivateGallery.State',
            'PrivateGallery.Password',
            'PrivateGallery.Blog_id',
            'PrivateGallery.SubscribersNotified',
            connection.raw(`COUNT("PrivateGallery"."Id") AS "Visits"`),
            connection.raw(
                `(SELECT COUNT("Id") FROM "PrivateGalleryEmail" WHERE "PrivateGallery_id" = "PrivateGallery"."Id") as "Emails"`
            )
        );

    return galleries.map((g: any) => ({
        id: g.Id,
        date: getDateString(new Date(g.Date)),
        title: g.Title,
        notes: g.Notes,
        state: Number(g.State),
        password: g.Password,
        blogId: g.Blog_id ? Number(g.Blog_id) : undefined,
        visits: g.Visits ? Number(g.Visits) : 0,
        pendingNotification: !g.SubscribersNotified && Number(g.State) === 1 && Number(g.Emails) > 0,
    }));
};

export const getStats = async (galleryId: number, startDate: Date, endDate: Date): Promise<GalleryVisitsDto> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    const visits = await connection('PrivateGalleryVisit')
        .where({ PrivateGallery_id: galleryId })
        .whereBetween('Date', [getDateString(startDate), getDateString(endDate)])
        .groupBy('Date')
        .select('Date', connection.raw(`COUNT("Date") as "Count"`));

    const dayVisits = visits.reduce(
        (prv, cur) => ({
            [getDateString(cur.Date)]: Number.parseInt(cur.Count),
            ...prv,
        }),
        {}
    );

    const dailyVisits = days.map(getDateString).map((x) => ({ date: x, visits: dayVisits[x] ?? 0 }));

    const bestDayVisits = await connection('PrivateGalleryVisit')
        .select('Date', connection.raw(`COUNT("Date") as "Count"`))
        .groupBy('Date')
        .where({ PrivateGallery_id: galleryId })
        .orderBy('Count', 'desc')
        .limit(1);

    const bestDay =
        bestDayVisits && bestDayVisits.length > 0
            ? {
                  date: getDateString(bestDayVisits[0].Date),
                  visits: bestDayVisits[0].Count,
              }
            : { date: '', visits: 0 };

    const totalVisitsResult = await connection('PrivateGalleryVisit')
        .where({ PrivateGallery_id: galleryId })
        .count('Id', { as: 'Visits' })
        .first();

    const totalVisits = totalVisitsResult ? (totalVisitsResult.Visits as number) : 0;

    const emailsResult = await connection('PrivateGalleryEmail')
        .count('Id', { as: 'Emails' })
        .where({ PrivateGallery_id: galleryId });

    const emails = emailsResult && emailsResult.length > 0 ? (emailsResult[0].Emails as number) : 0;

    const todayVisitsResult = await connection('PrivateGalleryVisit')
        .count('Id', { as: 'Count' })
        .where({ PrivateGallery_id: galleryId, Date: today })
        .first();

    const todayVisits = todayVisitsResult ? (todayVisitsResult.Count as number) : 0;

    const rangeVisits = sum(dailyVisits, (d) => d.visits);

    return {
        bestDay,
        dailyVisits,
        totalVisits,
        rangeDays: days.length,
        rangeVisits,
        emails,
        todayVisits,
    };
};

export const checkPasswordIsUnique = async (password: string, galleryId?: number): Promise<boolean> => {
    const gallery = await connection('PrivateGallery').where({ Password: password }).select('Id').first();

    return !gallery || gallery.Id === galleryId;
};

export const getForEdit = async (galleryId: number): Promise<GalleryEditDto> => {
    const [gallery] = await connection('PrivateGallery')
        .select('Date', 'Title', 'Notes', 'State', 'Password', 'DirectPath', 'Blog_id')
        .where({ Id: galleryId })
        .limit(1);

    return {
        date: getDateString(gallery.Date),
        title: gallery.Title,
        notes: gallery.Notes,
        state: Number(gallery.State),
        password: gallery.Password,
        directPath: gallery.DirectPath,
        blog: gallery.Blog_id ? Number(gallery.Blog_id) : null,
    };
};

export const createGallery = async (gallery: GalleryEditDto) => {
    try {
        await connection('PrivateGallery').insert({
            Date: gallery.date,
            Title: gallery.title,
            Notes: gallery.notes,
            State: gallery.state,
            Password: gallery.password,
            DirectPath: gallery.directPath,
            Blog_id: gallery.blog,
            SubscribersNotified: false,
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const editGallery = async (id: number, gallery: GalleryEditDto) => {
    try {
        await connection('PrivateGallery')
            .update({
                Date: gallery.date,
                Title: gallery.title,
                Notes: gallery.notes,
                State: gallery.state,
                Password: gallery.password,
                DirectPath: gallery.directPath,
                Blog_id: gallery.blog,
            })
            .where({ Id: id });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteGallery = async (id: number) => {
    const transaction = await connection.transaction();
    try {
        await transaction('PrivateGallery').delete().where({ Id: id });
        await transaction('PrivateGalleryEmail').delete().where({ PrivateGallery_id: id });
        await transaction('PrivateGalleryVisit').delete().where({ PrivateGallery_id: id });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        return Promise.reject(err);
    }
};

export const getEmails = async (galleryId: number): Promise<GalleryEmailsDto> => {
    const emails = await connection('PrivateGalleryEmail').where({ PrivateGallery_id: galleryId }).select('Address');

    const [{ SubscribersNotified, State, Emails }] = await connection('PrivateGallery')
        .where({ Id: galleryId })
        .select(
            'SubscribersNotified',
            'State',
            connection.raw(
                `(SELECT COUNT("Id") FROM "PrivateGalleryEmail" WHERE "PrivateGallery_id" = "PrivateGallery"."Id") as "Emails"`
            )
        );

    return {
        pendingNotification: !SubscribersNotified && Number(State) === 1 && Number(Emails) > 0,
        emails: emails.map((e) => ({ address: e.Address })),
    };
};

export const markAsNotified = async (id: number) => {
    try {
        await connection('PrivateGallery')
            .update({
                SubscribersNotified: true,
            })
            .where({ Id: id });
    } catch (err) {
        return Promise.reject(err);
    }
};
