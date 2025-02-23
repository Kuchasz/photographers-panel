import * as event from "@pp/api/dist/event/event";
import * as eventModel from "../models/event";
import * as user from "@pp/api/dist/user";
import { ResultType } from "@pp/api/dist/common";

export const registerEvent = async (data: event.EventDto): Promise<event.RegisterEventResult> => {
    try {
        await eventModel.registerEvent(data.type, data.user);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileRegisteringEvent',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const getEventsList = async (): Promise<event.EventDto[]> => {
    return await eventModel.getList();
};
