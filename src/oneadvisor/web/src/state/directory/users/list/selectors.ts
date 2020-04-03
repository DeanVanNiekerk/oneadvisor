import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.users.list;

export const usersSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
