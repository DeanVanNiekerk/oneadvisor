import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { TokenData } from "../types";
import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.auth.token;

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

export const useCaseSelector: (state: RootState) => string[] = createSelector(
    tokenDataSelector,
    (tokenData) => {
        return tokenData && tokenData.useCaseIds ? tokenData.useCaseIds : [];
    }
);

export const roleSelector: (state: RootState) => string[] = createSelector(
    tokenDataSelector,
    (tokenData) => {
        //http://schemas.microsoft.com/ws/2008/06/identity/claims/role is a backward compatibility support, can remove after 01/06/2020
        return tokenData
            ? tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                  tokenData.roles
            : [];
    }
);
