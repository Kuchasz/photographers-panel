export type ResultType = 'success' | 'error';

type Success<U> = { type: 'success'; result ?: U };
type Error<T> = { type: 'error'; error: T; errorMessage ?: string };

export type Result<T, U = null> = Success<U> | Error<T>;