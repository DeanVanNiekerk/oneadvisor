import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicyProductTypeState } from "../";

const rootSelector = (state: RootState): PolicyProductTypeState =>
    state.client.lookups.policyProductTypes.policyProductType;

export const policyProductTypeSelector: (
    state: RootState
) => PolicyProductTypeState = createSelector(rootSelector, (root) => root);
