import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { CommissionTypeState } from "../";

const rootSelector = (state: RootState): CommissionTypeState =>
    state.commission.lookups.commissionTypes.commissionType;

export const commissionTypeSelector: (state: RootState) => CommissionTypeState = createSelector(
    rootSelector,
    (root) => root
);
