import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.branchesSimple.list;

export const branchesSimpleSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
