import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.usersSimple.userSimple;

export const userSimpleSelector: (state: RootState) => State = createSelector(
    rootSelector,
    (root) => root
);
