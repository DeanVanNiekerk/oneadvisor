import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { CommissionLapseState } from "./types";

const rootSelector = (state: RootState): CommissionLapseState =>
    state.commission.reports.commissionLapse;

export const commissionLapseSelector: (state: RootState) => CommissionLapseState = createSelector(
    rootSelector,
    (root) => root
);
