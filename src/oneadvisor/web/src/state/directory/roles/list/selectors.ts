import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.roles.list;

export const rolesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
