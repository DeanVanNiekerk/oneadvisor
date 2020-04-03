import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { AllocationState } from "../";

const rootSelector = (state: RootState): AllocationState => state.commission.allocations.allocation;

export const allocationSelector: (state: RootState) => AllocationState = createSelector(
    rootSelector,
    (root) => root
);
