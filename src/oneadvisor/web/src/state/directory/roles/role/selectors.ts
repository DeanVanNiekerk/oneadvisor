import { createSelector } from "reselect";

import { RootState } from "@/state";

import { RoleState } from "../";

const rootSelector = (state: RootState): RoleState => state.directory.roles.role;

export const roleSelector: (state: RootState) => RoleState = createSelector(
    rootSelector,
    (root) => root
);
