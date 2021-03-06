import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.users.list;

export const usersSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
