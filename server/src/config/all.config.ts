export const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

export const notifications = {
    server: {
        host: process.env.NOTIFICATIONS_HOST,
        port: Number(process.env.NOTIFICATIONS_PORT), //port number
        secure: process.env.NOTIFICATIONS_AUTH_SECURE, //use secured connection
        auth: {
            user: process.env.NOTIFICATIONS_AUTH_USER,
            pass: process.env.NOTIFICATIONS_AUTH_PASS
        }
    },
    message: {
        target: process.env.NOTIFICATIONS_MESSAGE_TARGET,
        from: process.env.NOTIFICATIONS_MESSAGE_FROM  
    }
};

export const auth = {
    secretKey: process.env.AUTH_SECRET_KEY,
    publicKey: process.env.AUTH_PUBLIC_KEY,
    cookieName: process.env.AUTH_COOKIE_NAME,
    maxAge: Number(process.env.AUTH_MAX_AGE) //session max age in seconds
};

export const app = {
    appPath: process.env.APP_APP_PATH,
    reviewUrl: process.env.APP_REVIEW_URL
}
