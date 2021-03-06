import { createSelector } from "reselect";

import { RootState } from "@/state";

import { UserSimpleState } from "../";

const rootSelector = (state: RootState): UserSimpleState =>
    state.lookups.directory.usersSimple.userSimple;

export const userSimpleSelector: (state: RootState) => UserSimpleState = createSelector(
    rootSelector,
    (root) => root
);
