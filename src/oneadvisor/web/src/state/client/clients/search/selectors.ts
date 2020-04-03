import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { SearchState } from "../";

const rootSelector = (state: RootState): SearchState => state.client.clients.search;

export const clientSearchSelector: (state: RootState) => SearchState = createSelector(
    rootSelector,
    (root) => root
);
