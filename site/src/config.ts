interface Config {
    stats: {
        siteId: number;
        urlBase: string;
    };
}

let _config: Config;

export const initialize = (config: Config) => {
    _config = config;
};

export const get = () => _config;
