import * as auth from "@pp/api/dist/panel/auth";
import * as config from "../../config";
import * as fs from "fs";
import { getModulePath } from "../../core/dependencies";
import { login } from "../../auth";
import { ResultType } from "@pp/api/dist/common";

export const logIn = async (req: any, res: any) => {
    let result: auth.LogInResult | undefined = undefined;

    try {
        const tokens = await login(req.body as auth.UserCredentials);
        result = {
            type: ResultType.Success,
            result: {
                authToken: tokens.encodedToken,
                refreshToken: tokens.encodedToken,
                issuedAt: tokens.iat,
                expireDate: tokens.exp,
            },
        };
        res.cookie(config.auth.cookieName, result.result!.authToken, {
            httpOnly: true,
            maxAge: config.auth.maxAge * 1000,
        }); //secure the cookie!!
    } catch (err) {
        console.log(err);
        result = {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileLogIn',
            errorMessage: JSON.stringify(err),
        };
    }

    res.json(result);
};

export const viewLogIn = async (req: any, res: any) => {
    const serverConfig = {
        stats: config.stats,
    };

    fs.readFile(getModulePath('@pp/panel/dist/index.html'), 'utf8', (err, template) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        return res.send(
            template.replace(
                `<div id="state-initializer">{initial_state}</div>`,
                `<script type="text/javascript">window.___ServerConfig___=${JSON.stringify(serverConfig)}</script>`
            )
        );
    });
};
