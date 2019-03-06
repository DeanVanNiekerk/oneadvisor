const config: Config = {
    baseApi: __OA_BASE_API__,
    environment: __ENVIRONMENT__ as Environments,
    ui: {
        pageHeaderHeight: 48,
        footerHeight: 50,
        pageSize: 10,
    },
};

export default config;

type Environments = "development" | "staging" | "production";

type Config = {
    baseApi: string;
    environment: Environments;
    ui: {
        pageHeaderHeight: number;
        footerHeight: number;
        pageSize: number;
    };
};
