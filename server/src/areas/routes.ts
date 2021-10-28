import { Router as createRouter } from "express";
import * as eventController from "./event";
import * as event from "@pp/api/event";

const r = createRouter();

r.post(event.reqisterEvent.route, eventController.registerEvent);
r.get(event.getEventsList.route, eventController.getEventsList);

export const router = r;