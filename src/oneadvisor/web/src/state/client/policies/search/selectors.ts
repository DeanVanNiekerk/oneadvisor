import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { SearchState } from "../";

const rootSelector = (state: RootState): SearchState => state.client.policies.search;

export const policySearchSelector: (state: RootState) => SearchState = createSelector(
    rootSelector,
    (root) => root
);
