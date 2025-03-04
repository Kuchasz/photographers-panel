import nodemailer from 'nodemailer';
import { type Result } from "~/result";

export interface Message {
    name: string;
    email: string;
    content: string;
}

export type MessageValidationError = 'NameTooShort' | 'ContentTooShort' | 'EmailInvalid' | 'InternalError';

export type SendResult = Result<MessageValidationError>;

const notifications = {
    server: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password',
        },
    },
    message: {
        from: 'your-email@gmail.com',
        target: 'your-email@gmail.com',
    },
};

const transporter = nodemailer.createTransport({
    host: notifications.server.host,
    port: notifications.server.port,
    secure: notifications.server.secure,
    auth: {
        user: notifications.server.auth.user,
        pass: notifications.server.auth.pass,
    },
});

const validateName = (message: Message) => message.name.length > 0;
const validateEmail = (message: Message) => /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/.test(message.email);
const validateContent = (message: Message) => message.content.length > 0;

const assert = (message: Message, validator: (message: Message) => boolean, errorMessage: MessageValidationError) =>
    validator(message) ? null : errorMessage;

const validate = (message: Message) => {
    const results = [
        assert(message, validateName, 'NameTooShort'),
        assert(message, validateEmail, 'EmailInvalid'),
        assert(message, validateContent, 'ContentTooShort'),
    ];

    return results.find((r) => r);
};

const sendEmail = async (from: string, email: string, content: string) =>
    new Promise<void>((res, rej) => {
        const message = {
            from: notifications.message.from,
            to: notifications.message.target,
            subject: `Nowa wiadomość od ${from}`,
            html: `<html>
                <p><strong>Imie:</strong> ${from}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Treść wiadomości:</strong> <br /><br />${content}</p>
            </html>`,
            replyTo: `${from} <${email}>`,
        };

        transporter.sendMail(message, (err) => {
            if (err) {
                rej(err as Error);
            } else {
                res();
            }
        });
    });

export const send = async (data: Message): Promise<SendResult> => {
    const error = validate(data);

    if (error) {
        return { type: 'error', error };
    }

    try {
        // await sendEmail(data.name, data.email, data.content);
        console.log('sendEmail', data);
        return { type: 'success' };
    } catch (err) {
        console.log(err);
        return { type: 'error', error: 'InternalError' };
    }
};
