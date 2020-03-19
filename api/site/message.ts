import { Result } from "../common";

export interface Message {
    name: string;
    email: string;
    content: string;
}

export type MessageValidationError = "NameTooShort" | "ContentTooShort" | "EmailInvalid" | "InternalError";

export type SendResult = Result<MessageValidationError>;

export const sendRoute = "/api/send-message";
export const send = (message: Message) =>
    new Promise<SendResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + sendRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })
            .then(result => result.json())
            .then(resolve);
    });