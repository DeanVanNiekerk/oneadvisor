import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicyProductState } from "../";

const rootSelector = (state: RootState): PolicyProductState =>
    state.client.lookups.policyProducts.policyProduct;

export const policyProductSelector: (state: RootState) => PolicyProductState = createSelector(
    rootSelector,
    (root) => root
);
