import { createSelector } from "reselect";

import { RootState } from "@/state";

import { UserMonthlyCommissionState } from "./types";

const rootSelector = (state: RootState): UserMonthlyCommissionState =>
    state.commission.reports.userMonthlyCommission;

export const userMonthlyCommissionSelector: (
    state: RootState
) => UserMonthlyCommissionState = createSelector(rootSelector, (root) => root);
