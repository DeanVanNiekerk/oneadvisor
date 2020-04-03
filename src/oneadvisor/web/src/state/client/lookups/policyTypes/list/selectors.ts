import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicyTypeListState } from "../";

const rootSelector = (state: RootState): PolicyTypeListState =>
    state.client.lookups.policyTypes.list;

export const policyTypesSelector: (state: RootState) => PolicyTypeListState = createSelector(
    rootSelector,
    (root) => root
);
