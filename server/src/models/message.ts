import { Message, MessageValidationError } from "@pp/api/site/message";
import * as email from "./email";

const validateName = (message: Message) => message.name.length > 0;
const validateEmail = (message: Message) =>
    email.validate(message.email);
const validateContent = (message: Message) => message.content.length > 0;

const assert = (message: Message, validator: (message: Message) => boolean, errorMessage: MessageValidationError) =>
    validator(message) ? null : errorMessage;

export const validate = (message: Message): MessageValidationError | null => {
    const results = [
        assert(message, validateName, "NameTooShort"),
        assert(message, validateEmail, "EmailInvalid"),
        assert(message, validateContent, "ContentTooShort")
    ];

    return results.filter(r => r)[0];
};
