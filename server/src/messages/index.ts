import { notifications } from "../config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: notifications.server.host,
    port: notifications.server.port,
    secure: notifications.server.secure,
    auth: {
        user: notifications.server.auth.user,
        pass: notifications.server.auth.pass
    }
} as any);

export const sendEmail = async (from: string, email: string, content: string) =>
    new Promise<void>((res, rej) => {
        const message = {
            from: notifications.message.from,
            to: notifications.message.target,
            subject: `Pyszstudio - Nowa wiadomość od ${from}`,
            html: `<html>
                <p><strong>Imie:</strong> ${from}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Treść wiadomości:</strong> <br /><br />${content}</p>
            </html>`,
            replyTo: `${from} <${email}>`
        };

        transporter.sendMail(message, (err) => {
            if (err) {
                rej(err)
            } else { res(); }
        });

    });
