import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicyProductListState } from "../";

const rootSelector = (state: RootState): PolicyProductListState =>
    state.client.lookups.policyProducts.list;

export const policyProductsSelector: (state: RootState) => PolicyProductListState = createSelector(
    rootSelector,
    (root) => root
);
