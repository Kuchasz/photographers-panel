import { connection } from "../db";
import { EventType } from "@pp/api/dist/event";
import { UserName } from "@pp/api/dist/user";

export const registerEvent = async (type: EventType, user: UserName) => {
    try {
        await connection('Event').insert({
            Type: type,
            User: user,
            OccuredOn: new Date(),
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getList = async () => {
    const events = await connection('Event')
        .select('Event.Type', 'Event.User', 'Event.OccuredOn')
        .orderBy('Event.OccuredOn', 'desc');

    return events.map((e: any) => ({
        type: e.Type,
        user: e.User,
        occuredOn: e.OccuredOn,
    }));
};
