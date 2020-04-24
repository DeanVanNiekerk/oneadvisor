import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyProductTypeListState } from "../";

const rootSelector = (state: RootState): PolicyProductTypeListState =>
    state.lookups.client.policyProductTypes.list;

export const policyProductTypesSelector: (
    state: RootState
) => PolicyProductTypeListState = createSelector(rootSelector, (root) => root);
