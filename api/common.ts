export enum ResultType {
    Success,
    Error
}

type Success = { type: ResultType.Success };
type Error<T> = { type: ResultType.Error; error: T };

export type Result<T> = Success | Error<T>;
