import { f, Result } from "./common";
import { UserName } from "./user";

export enum EventType {
    CalculatorConfigChanged = 0,
    PhotoLiked = 1,
    PhotoUnliked = 2,
    PhotoDownloaded = 3
}

export type EventDto = {
    user: UserName,
    type: EventType,
    occuredOn: Date
}

export type RegisterEventError = 'ErrorOccuredWhileRegisteringEvent';
export type RegisterEventResult = Result<RegisterEventError>;

const reqisterEventRoute = '/api/register-event';
export const reqisterEvent = (type: EventType, user: UserName) =>
    f.post<RegisterEventResult>(reqisterEventRoute, {
        type,
        user
    });
reqisterEvent.route = reqisterEventRoute;

const getEventsListRoute = '/api/events';
export const getEventsList = () => f.get<EventDto[]>(getEventsListRoute);
getEventsList.route = getEventsListRoute;