import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.branches.branch;

export const branchSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const branchIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.branch, root.branchOriginal)
);

export const branchIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => root.updating || root.fetching
);
