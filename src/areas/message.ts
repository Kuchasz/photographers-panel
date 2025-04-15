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
}

export type MessageValidationError = 'NameTooShort' | 'ContentTooShort' | 'EmailInvalid' | 'InternalError';

export type SendResult = Result<MessageValidationError>;

const notifications = {
    server: {
        host: process.env.NOTIFICATIONS_HOST,
        port: parseInt(process.env.NOTIFICATIONS_PORT || '465', 10),
        secure: process.env.NOTIFICATIONS_AUTH_SECURE === 'true',
        auth: {
            user: process.env.NOTIFICATIONS_AUTH_USER,
            pass: process.env.NOTIFICATIONS_AUTH_PASS,
        },
    },
    message: {
        from: process.env.NOTIFICATIONS_MESSAGE_FROM,
        target: process.env.NOTIFICATIONS_MESSAGE_TARGET,
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

const assert = (message: Message, validator: (message: Message) => boolean, errorMessage: MessageValidationError) =>
    validator(message) ? null : errorMessage;

const validate = (message: Message) => {
    const results = [
        assert(message, validateName, 'NameTooShort'),
        assert(message, validateEmail, 'EmailInvalid'),
    ];

    return results.find((r) => r);
};

const sendEmail = async (message: Message) =>
    new Promise<void>((res, rej) => {
        const emailContent = {
            from: notifications.message.from,
            to: notifications.message.target,
            subject: `Nowa wiadomość od ${message.name}`,
            html: `<!DOCTYPE html>
                    <html lang="pl">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Nowa wiadomość kontaktowa</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .message-header {
                                border-bottom: 2px solid #f0f0f0;
                                padding-bottom: 15px;
                                margin-bottom: 20px;
                            }
                            .message-header h1 {
                                color: #444;
                                font-size: 24px;
                                margin: 0;
                            }
                            .message-body {
                                background-color: #fafafa;
                                border-radius: 5px;
                                padding: 20px;
                            }
                            .field {
                                margin-bottom: 15px;
                            }
                            .field-label {
                                font-weight: bold;
                                color: #666;
                                display: block;
                                margin-bottom: 5px;
                            }
                            .field-value {
                                padding-left: 10px;
                            }
                            .additional-details {
                                margin-top: 20px;
                                padding-top: 15px;
                                border-top: 1px solid #eee;
                            }
                            .footer {
                                margin-top: 20px;
                                font-size: 12px;
                                color: #999;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="message-header">
                            <h1>Nowa wiadomość kontaktowa</h1>
                        </div>
                        
                        <div class="message-body">
                            <div class="field">
                                <span class="field-label">Imię i nazwisko:</span>
                                <div class="field-value">${message.name}</div>
                            </div>
                            
                            <div class="field">
                                <span class="field-label">E-mail:</span>
                                <div class="field-value"><a href="mailto:${message.email}">${message.email}</a></div>
                            </div>
                            
                            ${message.weddingDate ? `
                            <div class="field">
                                <span class="field-label">Data ślubu:</span>
                                <div class="field-value">${message.weddingDate}</div>
                            </div>` : ''}
                            
                            ${message.weddingPlace ? `
                            <div class="field">
                                <span class="field-label">Miejscowość planowanej uroczystości:</span>
                                <div class="field-value">${message.weddingPlace}</div>
                            </div>` : ''}
                            
                            ${message.weddingVenue ? `
                            <div class="field">
                                <span class="field-label">Dom weselny lub restauracja:</span>
                                <div class="field-value">${message.weddingVenue}</div>
                            </div>` : ''}
                            
                            ${message.howDidYouHear ? `
                            <div class="field">
                                <span class="field-label">Skąd się o nas dowiedzieliście:</span>
                                <div class="field-value">${message.howDidYouHear}</div>
                            </div>` : ''}
                            
                            ${message.additionalDetails ? `
                            <div class="additional-details">
                                <span class="field-label">Dodatkowe informacje:</span>
                                <div class="field-value">${message.additionalDetails.replace(/\n/g, '<br>')}</div>
                            </div>` : ''}
                        </div>
                        
                        <div class="footer">
                            Ta wiadomość została wysłana z formularza kontaktowego.
                        </div>
                    </body>
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
        await sendEmail(data);
        console.log('sendEmail', data);
        return { type: 'success' };
    } catch (err) {
        console.log(err);
        return { type: 'error', error: 'InternalError' };
    }
};
