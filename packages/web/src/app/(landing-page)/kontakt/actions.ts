"use server";

import { type Message } from "@pp/api/dist/site/message";
import { send } from "~/areas/message";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (message: Message) => {
    await wait(5000);
    return await send(message);
};