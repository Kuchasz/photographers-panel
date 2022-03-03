import { config as setConfig } from "dotenv";
import { resolve } from "path";

setConfig({
    path:
        process.env === ('production' as any)
            ? resolve(__dirname + '../../.env')
            : resolve(__dirname + '../../../../../.env'),
});

export const getEnv = () => process.env;
