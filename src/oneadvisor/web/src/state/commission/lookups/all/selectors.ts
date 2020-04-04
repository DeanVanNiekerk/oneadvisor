import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AllLookupsState } from "./";

const rootSelector = (state: RootState): AllLookupsState => state.commission.lookups.all;

export const lookupsSelector: (state: RootState) => AllLookupsState = createSelector(
    rootSelector,
    (root) => root
);
