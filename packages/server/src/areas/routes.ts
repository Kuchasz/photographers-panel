import * as event from "@pp/api/dist/event";
import * as eventController from "./event";
import { Router as createRouter, Router } from "express";
import { verify } from "../auth";

const r = createRouter();

r.post(event.reqisterEvent.route, eventController.registerEvent);
r.get(event.getEventsList.route, verify, eventController.getEventsList);

export const router = r as Router;
