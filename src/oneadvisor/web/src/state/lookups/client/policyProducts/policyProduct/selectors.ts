import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyProductState } from "../types";

const rootSelector = (state: RootState): PolicyProductState =>
    state.lookups.client.policyProducts.policyProduct;

export const policyProductSelector: (state: RootState) => PolicyProductState = createSelector(
    rootSelector,
    (root) => root
);
