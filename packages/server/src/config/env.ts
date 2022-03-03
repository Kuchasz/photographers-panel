import { config as setConfig } from "dotenv";
import { resolveFromRoot } from "../core/paths";

setConfig({
    path: resolveFromRoot('.env'),
});

export const getEnv = () => process.env;
