import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AllLookupsState } from "./";

const rootSelector = (state: RootState): AllLookupsState => state.directory.lookups.all;

export const directoryLookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
