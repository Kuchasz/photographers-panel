export enum ResultType {
    Success,
    Error
}

type Success<U> = { type: ResultType.Success, result?: U };
type Error<T> = { type: ResultType.Error; error: T, errorMessage?: string };

export type Result<T, U = null> = Success<U> | Error<T>;

export let endpoint = "";
export const setEndpoint = (appPath: string) => endpoint = appPath;