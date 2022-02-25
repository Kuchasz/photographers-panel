import { getEnv } from "./env";

const env = getEnv();

export const db = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
};

export const notifications = {
    server: {
        host: env.NOTIFICATIONS_HOST,
        port: Number(env.NOTIFICATIONS_PORT), //port number
        secure: env.NOTIFICATIONS_AUTH_SECURE, //use secured connection
        auth: {
            user: env.NOTIFICATIONS_AUTH_USER,
            pass: env.NOTIFICATIONS_AUTH_PASS,
        },
    },
    message: {
        target: env.NOTIFICATIONS_MESSAGE_TARGET,
        from: env.NOTIFICATIONS_MESSAGE_FROM,
    },
};

export const auth = {
    secretKey: env.AUTH_SECRET_KEY!,
    publicKey: env.AUTH_PUBLIC_KEY!,
    cookieName: env.AUTH_COOKIE_NAME!,
    maxAge: Number(env.AUTH_MAX_AGE), //session max age in seconds
};

export const app = {
    appPath: env.APP_APP_PATH,
    reviewUrl: env.APP_REVIEW_URL,
};

export const stats = {
    siteId: env.STATS_SITE_ID,
    urlBase: env.STATS_URL_BASE,
    authToken: env.STATS_AUTH_TOKEN,
};
