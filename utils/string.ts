export const truncate = (chars: number, s: string) => (s.length > chars ? s.slice(0, chars).concat('...') : s);
export const trim = (chars: number, s: string) => s.slice(0, chars);
