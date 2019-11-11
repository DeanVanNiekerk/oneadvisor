import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.auth.token;

export const tokenSelector: (state: RootState) => State = createSelector(rootSelector, root => root);

export const isAuthenticatedSelector: (state: RootState) => boolean = createSelector(tokenSelector, root => {
    return root.token != null;
});

export const userOrganisationIdSelector: (state: RootState) => string = createSelector(tokenSelector, root => {
    if (!root.tokenData) return "";
    return root.tokenData.organisationId;
});

export const useCaseSelector: (state: RootState) => string[] = createSelector(tokenSelector, root => {
    return root.tokenData && root.tokenData.useCaseIds ? root.tokenData.useCaseIds : [];
});

export const roleSelector: (state: RootState) => string[] = createSelector(tokenSelector, root => {
    return root.tokenData ? root.tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : [];
});
