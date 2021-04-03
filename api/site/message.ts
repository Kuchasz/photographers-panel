import { Result, f } from "../common";

export interface Message {
    name: string;
    email: string;
    content: string;
}

export type MessageValidationError = "NameTooShort" | "ContentTooShort" | "EmailInvalid" | "InternalError";

export type SendResult = Result<MessageValidationError>;

export const sendRoute = "/api/send-message";
export const send = (message: Message) =>
    f.post<SendResult>(sendRoute, message);
send.route = sendRoute;
