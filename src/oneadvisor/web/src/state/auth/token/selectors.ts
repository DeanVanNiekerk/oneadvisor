import { createSelector } from "reselect";

import { RootState } from "@/state";

import { TokenData, TokenState } from "../types";

const rootSelector = (state: RootState): TokenState => state.auth.token;

export const tokenSelector: (state: RootState) => string | null = createSelector(
    rootSelector,
    (root) => root.token
);

export const tokenDataSelector: (state: RootState) => TokenData | null = createSelector(
    rootSelector,
    (root) => root.tokenData
);

export const isAuthenticatedSelector: (state: RootState) => boolean = createSelector(
    tokenSelector,
    (root) => {
        return root != null;
    }
);

export const userOrganisationIdSelector: (state: RootState) => string = createSelector(
    tokenDataSelector,
    (tokenData) => {
        if (!tokenData) return "";
        return tokenData.organisationId;
    }
);

export const userOrganisationNameSelector: (state: RootState) => string = createSelector(
    tokenDataSelector,
    (tokenData) => {
        if (!tokenData) return "";
        return tokenData.organisationName;
    }
);

export const userFullNameSelector: (state: RootState) => string = createSelector(
    tokenDataSelector,
    (tokenData) => {
        if (!tokenData) return "";
        return `${tokenData.firstName} ${tokenData.lastName}`;
    }
);

export const useCaseSelector: (state: RootState) => string[] = createSelector(
    tokenDataSelector,
    (tokenData) => {
        if (!tokenData || !tokenData.useCaseIds) return [];
        if (typeof tokenData.useCaseIds === "string") return [tokenData.useCaseIds];
        return tokenData.useCaseIds;
    }
);

export const roleSelector: (state: RootState) => string[] = createSelector(
    tokenDataSelector,
    (tokenData) => {
        if (!tokenData || !tokenData.roles) return [];
        if (typeof tokenData.roles === "string") return [tokenData.roles];
        return tokenData.roles;
    }
);
