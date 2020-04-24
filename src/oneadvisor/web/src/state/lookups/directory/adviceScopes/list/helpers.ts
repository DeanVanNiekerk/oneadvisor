import { AdviceScope } from "../types";

export const getAdviceScopeName = (adviceScopeId: string, adviceScopes: AdviceScope[]): string => {
    const adviceScope = adviceScopes.find((c) => c.id === adviceScopeId);

    if (!adviceScope) return "";

    return adviceScope.name;
};
