import { createSelector } from "reselect";

import { RootState } from "@/state";

import { RoaInvestInputState } from "./types";

const rootSelector = (state: RootState): RoaInvestInputState => state.compliance.roa.invest.inputs;

export const roaInvestSelector: (state: RootState) => RoaInvestInputState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);
