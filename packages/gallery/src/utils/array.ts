export const sum = <T>(pred: (el: T) => number) => (arr: T[]) => arr.reduce((sum, el) => sum + pred(el), 0);
export const sort = <T>(pred: (el: T) => number) => (arr: T[]) => [...arr].sort((a, b) => pred(a) - pred(b));
