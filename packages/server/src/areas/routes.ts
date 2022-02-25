import * as event from "@pp/api/dist/event";
import * as eventController from "./event";
import { Router as createRouter, Router } from "express";

const r = createRouter();

r.post(event.reqisterEvent.route, eventController.registerEvent);
r.get(event.getEventsList.route, eventController.getEventsList);

export const router = r as Router;
