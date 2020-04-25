import { createSelector } from "reselect";

import { RootState } from "@/state";

import { BranchesSimpleListState } from "../";

const rootSelector = (state: RootState): BranchesSimpleListState =>
    state.lookups.directory.branchesSimple.list;

export const branchesSimpleSelector: (state: RootState) => BranchesSimpleListState = createSelector(
    rootSelector,
    (root) => root
);
