import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyTypeListState } from "../types";

const rootSelector = (state: RootState): PolicyTypeListState =>
    state.lookups.client.policyTypes.list;

export const policyTypesSelector: (state: RootState) => PolicyTypeListState = createSelector(
    rootSelector,
    (root) => root
);
