import nodemailer from 'nodemailer';
import { type Result } from "~/result";

export interface Message {
    name: string;
    email: string;
    weddingDate?: string;
    weddingPlace?: string;
    weddingVenue?: string;
    howDidYouHear?: string;
    additionalDetails?: string;
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

const sendEmail = async (message: Message) =>
    new Promise<void>((res, rej) => {
        const emailContent = {
            from: notifications.message.from,
            to: notifications.message.target,
            subject: `Nowa wiadomość od ${message.name}`,
            html: `<html>
                <p><strong>Imie:</strong> ${message.name}</p>
                <p><strong>E-mail:</strong> ${message.email}</p>
                ${message.weddingDate ? `<p><strong>Data ślubu:</strong> ${message.weddingDate}</p>` : ''}
                ${message.weddingPlace ? `<p><strong>Miejscowość planowanej uroczystości:</strong> ${message.weddingPlace}</p>` : ''}
                ${message.weddingVenue ? `<p><strong>Dom weselny lub restauracja:</strong> ${message.weddingVenue}</p>` : ''}
                ${message.howDidYouHear ? `<p><strong>Skąd się o nas dowiedzieliście:</strong> ${message.howDidYouHear}</p>` : ''}
                ${message.additionalDetails ? `<p><strong>Dodatkowe informacje:</strong> <br /><br />${message.additionalDetails}</p>` : ''}
                <p><strong>Treść wiadomości:</strong> <br /><br />${message.content}</p>
            </html>`,
            replyTo: `${message.name} <${message.email}>`,
        };

        transporter.sendMail(emailContent, (err) => {
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
        // await sendEmail(data);
        console.log('sendEmail', data);
        return { type: 'success' };
    } catch (err) {
        console.log(err);
        return { type: 'error', error: 'InternalError' };
    }
};
