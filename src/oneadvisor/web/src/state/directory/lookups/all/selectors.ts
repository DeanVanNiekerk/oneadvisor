import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { AllLookupsState } from "./";

const rootSelector = (state: RootState): AllLookupsState => state.directory.lookups.all;

export const directoryLookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
