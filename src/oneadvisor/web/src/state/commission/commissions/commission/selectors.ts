import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { CommissionState } from "../";

const rootSelector = (state: RootState): CommissionState => state.commission.commissions.commission;

export const commissionSelector: (state: RootState) => CommissionState = createSelector(
    rootSelector,
    (root) => root
);

export const commissionIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.commission, root.commissionOriginal)
);

export const commissionIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);
