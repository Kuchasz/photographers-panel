import { Result, f } from "../common";

export interface UserCredentials {
    username: string;
    password: string;
}

export type LogInError = "ErrorOccuredWhileLogIn";
export type LogInResult = Result<LogInError, { authToken: string, refreshToken: string, issuedAt: number, expireDate: number }>;

const logInRoute = "/api/panel/log-in";
export const logIn = (credentials: UserCredentials) =>
    f.post<LogInResult>(logInRoute, credentials);
logIn.route = logInRoute;

const viewLogInRoute = "/panel";
export const viewLogIn = () => { };
viewLogIn.route = viewLogInRoute;