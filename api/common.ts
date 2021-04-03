export enum ResultType {
    Success,
    Error
}

type Success<U> = { type: ResultType.Success, result?: U };
type Error<T> = { type: ResultType.Error; error: T, errorMessage?: string };

export type Result<T, U = null> = Success<U> | Error<T>;

export let endpoint = "";
export const setEndpoint = (appPath: string) => endpoint = appPath;

export const f = {
    post: <T>(url: string, body: any) =>
        fetch(endpoint + url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json" },
            body: JSON.stringify(body)})
        .then((result) => result.json() as Promise<T>),
    get: <T>(url: string) => fetch(endpoint + url).then(resp => resp.json() as Promise<T>)
}