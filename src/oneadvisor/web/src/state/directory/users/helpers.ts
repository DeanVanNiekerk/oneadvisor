import { Config } from "./";

export const getConfig = (config: Partial<Config> = {}): Config => {
    return {
        adviceScopeIds: [],
        licenseCategoryIds: [],
        ...config,
    };
};
