import { createSelector } from "reselect";

import { RootState } from "@/state";

import { RoaInvestDataState } from "./types";

const rootSelector = (state: RootState): RoaInvestDataState => state.compliance.roa.invest.data;

export const roaInvestDataSelector: (state: RootState) => RoaInvestDataState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);
