import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyProductListState } from "../";

const rootSelector = (state: RootState): PolicyProductListState =>
    state.lookups.client.policyProducts.list;

export const policyProductsSelector: (state: RootState) => PolicyProductListState = createSelector(
    rootSelector,
    (root) => root
);
