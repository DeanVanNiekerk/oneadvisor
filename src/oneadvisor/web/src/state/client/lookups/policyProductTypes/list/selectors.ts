import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicyProductTypeListState } from "../";

const rootSelector = (state: RootState): PolicyProductTypeListState =>
    state.client.lookups.policyProductTypes.list;

export const policyProductTypesSelector: (
    state: RootState
) => PolicyProductTypeListState = createSelector(rootSelector, (root) => root);
