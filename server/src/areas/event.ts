import * as eventModel from "../models/event";
import * as event from "@pp/api/event";
import * as user from "@pp/api/user";
import { ResultType } from "@pp/api/common";

export const registerEvent = async (req, res) => {
    let result: event.RegisterEventResult | undefined = undefined;

    try {
        const { type, user } = req.body as { type: event.EventType, user: user.UserName }
        await eventModel.registerEvent(type, user);
        result = { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileRegisteringEvent',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const getEventsList =  async (_req, res) => {
    const events = await eventModel.getList();
    res.json(events);
};