import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { UserState } from "../";

const rootSelector = (state: RootState): UserState => state.directory.users.user;

export const userSelector: (state: RootState) => UserState = createSelector(
    rootSelector,
    (root) => root
);

export const userIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.user, root.userOriginal)
);

export const userIsNew: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !(root.user && root.user.id)
);
