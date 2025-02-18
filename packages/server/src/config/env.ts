import { config as setConfig } from "dotenv";
import { resolveFromRoot } from "../core/paths";

console.log(resolveFromRoot('.env'));

setConfig({
    path: resolveFromRoot('.env'),
});

export const getEnv = () => process.env;
