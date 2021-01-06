
export const clamp = (a: number, b: number) => (num: number) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
