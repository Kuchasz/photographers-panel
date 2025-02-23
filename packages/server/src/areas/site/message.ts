import * as message from "@pp/api/dist/site/message";
import * as messageModel from "../../models/message";
import { ResultType } from "@pp/api/dist/common";
import { sendEmail } from "../../messages";

export const send = async (data: message.Message): Promise<message.SendResult> => {
    const error = messageModel.validate(data);

    if (error) {
        return { type: ResultType.Error, error };
    }

    try {
        await sendEmail(data.name, data.email, data.content);
        return { type: ResultType.Success };
    } catch (err) {
        console.log(err);
        return { type: ResultType.Error, error: 'InternalError' };
    }
};
