import { resolveFromRoot } from "./paths";
export const getModulePath = (path: string) => resolveFromRoot(`node_modules/${path}`);
