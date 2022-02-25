interface Config {
    stats: {
        siteId: number;
        urlBase: string;
        authToken: string;
    };
}

export const config: Config = (window as any).___ServerConfig___;

delete (window as any).___ServerConfig___;
