import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.commissions.commission;

export const commissionSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const commissionIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.commission, root.commissionOriginal)
);

export const commissionIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => root.updating || root.fetching
);