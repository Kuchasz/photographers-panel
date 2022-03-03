import { config as setConfig } from "dotenv";
import { resolve } from "path";

setConfig({
    path:
        process.env.NODE_ENV === 'production'
            ? resolve(__dirname + '../../../.env')
            : resolve(__dirname + '../../../../../.env'),
});

export const getEnv = () => process.env;
