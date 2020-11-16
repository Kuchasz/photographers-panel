import { connection } from "../db";

export const exists = async (date: Date, ip: string): Promise<boolean> => {
    const rows = await connection("PageVisit")
        .where({ Date: date, Ip: ip })
        .select("Id")
        .limit(1);

    return rows.length !== 0;
}

export const registerVisit = async (date: Date, ip: string) => {
    try {
        if (await exists(date, ip)) {
            return Promise.resolve();
        }

        await connection("PageVisit")
            .insert({ Date: date, Ip: ip });
    } catch (err) {
        return Promise.reject();
    }
}