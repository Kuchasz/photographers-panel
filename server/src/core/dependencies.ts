import { resolve } from 'path';
export const requireModule = (path: string) => resolve(__dirname + `../../../../node_modules/${path}`);