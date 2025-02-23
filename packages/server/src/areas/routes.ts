import * as event from "@pp/api/dist/event/event";
import * as eventController from "./event";
import { Router as createRouter } from "express";
import { verify } from "../auth";
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { eventContract } from '@pp/api/dist/contracts';

const r = createRouter();
const s = initServer();

const eventImplementation = s.router(eventContract, {
    registerEvent: async ({ body }: { body: event.EventDto }) => {
        const result = await eventController.registerEvent(body);
        return { status: 200 as const, body: result };
    },
    getEventsList: async () => {
        const result = await eventController.getEventsList();
        return { status: 200 as const, body: result };
    },
});

// Mount ts-rest router
createExpressEndpoints(eventContract, eventImplementation, r);

// Add verify middleware to getEventsList endpoint
r.use(event.getEventsList.route, verify);

export const router = r;
