import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyProductTypeState } from "../";

const rootSelector = (state: RootState): PolicyProductTypeState =>
    state.lookups.client.policyProductTypes.policyProductType;

export const policyProductTypeSelector: (
    state: RootState
) => PolicyProductTypeState = createSelector(rootSelector, (root) => root);
