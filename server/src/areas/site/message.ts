import * as messageModel from "../../models/message";
import * as message from "@pp/api/site/message";
import { ResultType } from "@pp/api/common";
import { sendEmail } from "../../messages";

export const send = async (req, res) => {
    const mesg = req.body as message.Message;

    const error = messageModel.validate(mesg);

    if (error) {
        res.json({ type: ResultType.Error, error });
        return;
    }

    try {
        await sendEmail(mesg.name, mesg.email, mesg.content);
        res.json({ type: ResultType.Success });
    } catch (err) {
        console.log(err);
        res.json({ type: ResultType.Error, error: 'InternalError' });
    }
};