import { resolve } from "path";
import { resolveFromRoot } from "./paths";
export const requireModule = (path: string) => resolveFromRoot(`node_modules/${path}`);
