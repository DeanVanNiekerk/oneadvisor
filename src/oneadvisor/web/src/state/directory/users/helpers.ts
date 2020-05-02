import { Config } from "./types";

export const getConfig = (config: Partial<Config> = {}): Config => {
    return {
        adviceScopeIds: [],
        licenseCategoryIds: [],
        ...config,
    };
};
