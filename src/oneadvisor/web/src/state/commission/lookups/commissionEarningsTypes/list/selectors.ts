import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { CommissionEarningsTypeListState } from "../";

const rootSelector = (state: RootState): CommissionEarningsTypeListState =>
    state.commission.lookups.commissionEarningsTypes.list;

export const commissionEarningsTypesSelector: (
    state: RootState
) => CommissionEarningsTypeListState = createSelector(rootSelector, (root) => root);
