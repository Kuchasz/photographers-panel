export interface Message {
    name: string;
    email: string;
    content: string;
}

export type MessageValidationError = "NameTooShort" | "ContentTooShort" | "EmailInvalid";

export enum MessageSendResultType {
    Success,
    Error
}

type Success = { type: MessageSendResultType.Success };
type Error = { type: MessageSendResultType.Error; error: MessageValidationError };

export type MessageSendResult = Success | Error;

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
