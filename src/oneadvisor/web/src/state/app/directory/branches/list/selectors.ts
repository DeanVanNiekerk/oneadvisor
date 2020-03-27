import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.branches.list;

export const branchesSelector: (state: RootState) => State = createSelector(
    rootSelector,
    (root) => root
);
