import { config as setConfig } from "dotenv";
import { resolve } from "path";

setConfig({ path: resolve(__dirname + '../../../../../.env') });

export const getEnv = () => process.env;
