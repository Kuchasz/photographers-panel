import { endpoint, Result } from "../common";

export interface UserCredentials {
    username: string;
    password: string;
}

export type LogInError = "ErrorOccuredWhileLogIn";
export type LogInResult = Result<LogInError, { authToken: string, refreshToken: string }>;

const logInRoute = "/api/panel/log-in";
export const logIn = (credentials: UserCredentials) =>
    new Promise<LogInResult>((resolve, _) => {
        fetch(endpoint + logInRoute, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
            .then((result) => result.json())
            .then(resolve);
    });
logIn.route = logInRoute;

const viewLogInRoute = "/panel";
export const viewLogIn = () => { };
viewLogIn.route = viewLogInRoute;