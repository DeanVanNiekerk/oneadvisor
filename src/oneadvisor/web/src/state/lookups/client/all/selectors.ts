import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AllLookupsState } from "./types";

const rootSelector = (state: RootState): AllLookupsState => state.lookups.client.all;

export const clientLookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
