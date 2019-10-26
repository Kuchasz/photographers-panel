import { Message, MessageValidationError } from "../../../api/send-message";

const validateName = (message: Message) => message.name.length > 0;
const validateEmail = (message: Message) =>
    /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/.test(message.email);
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
