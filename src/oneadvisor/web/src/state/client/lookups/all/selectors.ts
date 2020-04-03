import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { AllLookupsState } from "./";

const rootSelector = (state: RootState): AllLookupsState => state.client.lookups.all;

export const clientLookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
