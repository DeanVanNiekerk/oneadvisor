import { createSelector } from "reselect";

import { RootState } from "@/state";

import { RoaInvestLookupsState } from "./types";

const rootSelector = (state: RootState): RoaInvestLookupsState =>
    state.compliance.roa.invest.lookups;

export const roaInvestLookupsSelector: (state: RootState) => RoaInvestLookupsState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);
