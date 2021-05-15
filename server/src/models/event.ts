import { connection } from '../db';
import { EventType } from '@pp/api/event';
import { UserName } from '@pp/api/user';
import { getDateTimeString } from '@pp/utils/date';

export const registerEvent = async (type: EventType, user: UserName) => {
    try {
        await connection('Event').insert({
            Type: type,
            User: user,
            OccuredOn: new Date()
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getList = async () => {
    const events = await connection('Event')
        .select(
            'Event.Type',
            'Event.User',
            'Event.OccuredOn')
        .orderBy('Event.OccuredOn', 'desc');

    return events.map((e: any) => ({
        type: e.Type,
        user: e.User,
        occuredOn: getDateTimeString(new Date(e.OccuredOn))
    }));
}