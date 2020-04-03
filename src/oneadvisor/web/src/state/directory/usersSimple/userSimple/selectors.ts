import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { UserSimpleState } from "../";

const rootSelector = (state: RootState): UserSimpleState => state.directory.usersSimple.userSimple;

export const userSimpleSelector: (state: RootState) => UserSimpleState = createSelector(
    rootSelector,
    (root) => root
);
