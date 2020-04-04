import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { BranchState } from "../";

const rootSelector = (state: RootState): BranchState => state.directory.branches.branch;

export const branchSelector: (state: RootState) => BranchState = createSelector(
    rootSelector,
    (root) => root
);

export const branchIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.branch, root.branchOriginal)
);

export const branchIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);
