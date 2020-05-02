import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.branches.list;

export const branchesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
