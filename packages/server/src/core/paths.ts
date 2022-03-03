import { resolve } from "path";

export const resolveFromRoot = (path: string) =>
    process.env.NODE_ENV === 'production'
        ? resolve(resolve(__dirname + '../../../' + path))
        : resolve(resolve(__dirname + '../../../../../' + path));
