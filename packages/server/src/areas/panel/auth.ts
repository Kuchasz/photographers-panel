import * as auth from "@pp/api/dist/panel/auth";
import * as config from "../../config";
import * as fs from "fs";
import { resolveModulePath } from "../../core/dependencies";
import { login } from "../../auth";
import { ResultType } from "@pp/api/dist/common";
import { Response } from "express";

export const logIn = async (credentials: auth.UserCredentials, res: Response): Promise<auth.LogInResult> => {
    try {
        const tokens = await login(credentials);
        const result: auth.LogInResult = {
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
        return result;
    } catch (err) {
        console.log(err);
        return {
            type: ResultType.Error,
            error: 'ErrorOccuredWhileLogIn',
            errorMessage: JSON.stringify(err),
        };
    }
};

export const viewLogIn = async (): Promise<string> => {
    const serverConfig = {
        stats: config.stats,
    };

    return new Promise((resolve, reject) => {
        fs.readFile(resolveModulePath('@pp/panel', 'dist/index.html'), 'utf8', (err, template) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(
                template.replace(
                    `<div id="state-initializer">{initial_state}</div>`,
                    `<script type="text/javascript">window.___ServerConfig___=${JSON.stringify(serverConfig)}</script>`
                )
            );
        });
    });
};
