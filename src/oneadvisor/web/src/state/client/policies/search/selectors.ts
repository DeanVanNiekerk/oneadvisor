import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PolicySearchState } from "../";

const rootSelector = (state: RootState): PolicySearchState => state.client.policies.search;

export const policySearchSelector: (state: RootState) => PolicySearchState = createSelector(
    rootSelector,
    (root) => root
);
