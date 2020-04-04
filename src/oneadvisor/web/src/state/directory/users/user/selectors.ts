import { createSelector } from "reselect";

import { RootState } from "@/state";

import { UserState } from "../";

const rootSelector = (state: RootState): UserState => state.directory.users.user;

export const userSelector: (state: RootState) => UserState = createSelector(
    rootSelector,
    (root) => root
);
