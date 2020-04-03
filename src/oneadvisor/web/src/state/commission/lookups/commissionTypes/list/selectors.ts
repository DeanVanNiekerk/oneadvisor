import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { CommissionTypeListState } from "../";

const rootSelector = (state: RootState): CommissionTypeListState =>
    state.commission.lookups.commissionTypes.list;

export const commissionTypesSelector: (
    state: RootState
) => CommissionTypeListState = createSelector(rootSelector, (root) => root);
