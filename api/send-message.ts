import { Result } from "./common";

export interface Message {
    name: string;
    email: string;
    content: string;
}

export type MessageValidationError = "NameTooShort" | "ContentTooShort" | "EmailInvalid";

export type MessageSendResult = Result<MessageValidationError>;

export const route = "/api/send-message";

export const sendMessage = (message: Message) =>
    new Promise<MessageSendResult>((resolve, _) => {
        fetch("http://192.168.56.102:8080" + route, {
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
