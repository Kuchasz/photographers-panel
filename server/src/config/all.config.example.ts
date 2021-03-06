export const db = {
    host: 'IP_ADDRESS',
    user: 'USER_NAME',
    password: 'PASSWORD',
    database: 'DATABASE_NAME',
};

export const notifications = {
    server: {
        host: 'SMTP_HOST',
        port: 0, //port number
        secure: false, //use secured connection
        auth: {
            user: 'USER_LOGIN',
            pass: 'USER_PASSWORD',
        },
    },
    message: {
        target: 'TARGET_EMAIL',
        from: 'FROM_EMAIL',
    },
};

export const auth = {
    secretKey: `RSA_256_PRIVATE_KEY`,
    publicKey: `RSA_256_PUBLIC_KEY`,
    cookieName: 'SESSION_COOKIE_NAME',
    maxAge: 0, //session max age in seconds
};

export const app = {
    appPath: 'http://APP_ROOT_PATH.com',
    reviewUrl: 'https://g.page/your-site/review',
};

export const stats = {
    siteId: 0, //siteid in piwik/matomo
    urlBase: 'https://PIWIK_MATOMO.com',
};
