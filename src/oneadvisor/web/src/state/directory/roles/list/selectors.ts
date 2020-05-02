import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.roles.list;

export const rolesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
