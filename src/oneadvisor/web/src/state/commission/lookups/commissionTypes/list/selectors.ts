import { createSelector } from "reselect";

import { RootState } from "@/state";

import { CommissionTypeListState } from "../";

const rootSelector = (state: RootState): CommissionTypeListState =>
    state.commission.lookups.commissionTypes.list;

export const commissionTypesSelector: (
    state: RootState
) => CommissionTypeListState = createSelector(rootSelector, (root) => root);
