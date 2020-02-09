import * as SendGridTypings from "@sendgrid/mail";
const SendGrid: typeof SendGridTypings.MailService = require("@sendgrid/mail");
import { notifications } from "../config";

SendGrid.setApiKey(notifications.sendGridApiKey);

export const sendEmail = async (from: string, email: string, content: string) =>
    new Promise<void>((res, rej) => {
        SendGrid.send(
            {
                to: notifications.targetEmail,
                from: notifications.fromEmail,
                replyTo: email,
                subject: `Pyszstudio - Nowa wiadomość od ${from}`,
                html: `<html>
                    <p><strong>Imie:</strong> ${from}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Treść wiadomości:</strong> <br /><br />${content}</p>
                </html>`
            },
            false,
            err => {
                if (err) rej();
                else res();
            }
        );
    });
