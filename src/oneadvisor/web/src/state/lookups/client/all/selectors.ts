import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AllLookupsState } from "./";

const rootSelector = (state: RootState): AllLookupsState => state.lookups.client.all;

export const clientLookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
