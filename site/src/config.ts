interface Config {
    stats: {
        siteId: number;
        urlBase: string;
    };
}

let _config: Config;

export const initialize = (config: Config) => {
    console.log('INITIALIZE CONFIG', JSON.stringify(config));
    _config = config;
};

export const get = () => _config;
