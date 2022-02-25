import * as panel from "@pp/api/dist/panel/site";
import { connection } from "../db";
import { getDateRange, getDateString } from "@pp/utils/dist/date";
import { getHttp } from "../core/http";
import { stats } from "../config";
import { sum } from "@pp/utils/dist/array";

export const exists = async (date: Date, ip: string): Promise<boolean> => {
    const rows = await connection('SiteVisit').where({ Date: date, Ip: ip }).select('Id').limit(1);

    return rows.length !== 0;
};

export const registerVisit = (date: Date, ip: string): Promise<any> =>
    connection.raw(
        `
        INSERT INTO "SiteVisit" ("Ip", "Date") 
        SELECT ?, ?
        WHERE
            NOT EXISTS (
                SELECT "Id" FROM "SiteVisit" WHERE "Ip"=? AND "Date"=?
            )`,
        [ip, date, ip, date]
    );

export const getStats = async (startDate: Date, endDate: Date): Promise<panel.SiteVisitsDto> => {
    const days = getDateRange(startDate, endDate);
    const today = getDateString(new Date());

    const visits = await connection('SiteVisit')
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

    const bestDayVisits = await connection('SiteVisit')
        .select('Date', connection.raw(`COUNT("Date") as "Count"`))
        .groupBy('Date')
        .orderBy('Count', 'desc')
        .limit(1);

    const bestDay =
        bestDayVisits && bestDayVisits.length > 0
            ? {
                  date: getDateString(bestDayVisits[0].Date),
                  visits: bestDayVisits[0].Count,
              }
            : { date: '', visits: 0 };

    const totalVisitsResult = await connection('SiteVisit').count('Id', { as: 'Visits' }).first();

    const totalVisits = totalVisitsResult ? (totalVisitsResult.Visits as number) : 0;

    const todayVisitsResult = await connection('SiteVisit').count('Id', { as: 'Count' }).where({ Date: today }).first();

    const todayVisits = todayVisitsResult ? (todayVisitsResult.Count as number) : 0;

    const rangeVisits = sum(dailyVisits, (d) => d.visits);

    return {
        bestDay,
        dailyVisits,
        totalVisits,
        rangeDays: days.length,
        rangeVisits,
        todayVisits,
    };
};

export const getEvents = (): Promise<panel.SiteEventDto[]> =>
    getHttp(
        `https://${stats.urlBase}/index.php?module=API&method=Events.getAction&idSite=${stats.siteId}&period=month&date=today&format=JSON&token_auth=${stats.authToken}&force_api_session=1`
    );
