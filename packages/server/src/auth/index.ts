import * as jwt from "../core/jwt";
import { auth } from "../config";
import { NextFunction, Request, Response } from "express";
import { UserCredentials } from "@pp/api/dist/panel/auth";

const admin_username = process.env.ADMIN_USER;
const admin_password = process.env.ADMIN_PASSWORD;

const validateCredentials = (username: string, password: string) =>
    username === admin_username && password === admin_password;

export const login = async ({ username, password }: UserCredentials) => {
    if (validateCredentials(username, password)) {
        const encodedToken = await jwt.sign({ username }, auth.secretKey, {
            algorithm: 'RS256',
            expiresIn: auth.maxAge,
        });
        const decoded = jwt.decode(encodedToken, { json: true });
        return { encodedToken, iat: Number(decoded!.iat), exp: Number(decoded!.exp) };
    } else {
        return Promise.reject('Invalid credentials');
    }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string = req.cookies[auth.cookieName];

    if (!accessToken) {
        return res.status(403).send();
    }

    let payload;

    try {
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = await jwt.verify(accessToken, auth.publicKey);
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        console.log(e);
        return res.status(401).send();
    }
};
