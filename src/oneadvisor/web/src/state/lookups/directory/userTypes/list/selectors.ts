import { createSelector } from "reselect";

import { RootState } from "@/state";

import { UserTypeListState } from "../";

const rootSelector = (state: RootState): UserTypeListState =>
    state.lookups.directory.userTypes.list;

export const userTypesSelector: (state: RootState) => UserTypeListState = createSelector(
    rootSelector,
    (root) => root
);
