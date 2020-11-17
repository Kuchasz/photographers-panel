import { connection } from "../db";

export const exists = async (date: Date, ip: string): Promise<boolean> => {
    const rows = await connection("PageVisit")
        .where({ Date: date, Ip: ip })
        .select("Id")
        .limit(1);

    return rows.length !== 0;
}

export const registerVisit = (date: Date, ip: string): Promise<any> =>
    connection.raw(`
        INSERT INTO "PageVisit" ("Ip", "Date") 
        SELECT ?, ?
        WHERE
            NOT EXISTS (
                SELECT "Id" FROM "PageVisit" WHERE "Ip"=? AND "Date"=?
            )`, [ip, date, ip, date]);