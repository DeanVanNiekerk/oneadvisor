import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { getValidationSubSet } from "@/app/validation";
import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";

import { Config, UserState } from "../";
import { getConfig } from "../helpers";

const rootSelector = (state: RootState): UserState => state.directory.users.user;

export const userSelector: (state: RootState) => UserState = createSelector(
    rootSelector,
    (root) => root
);

export const userConfigSelector: (state: RootState) => Config = createSelector(
    rootSelector,
    (root) => (root.user ? root.user.config : getConfig())
);

export const userConfigValidationResultsSelector: (
    state: RootState
) => ValidationResult[] = createSelector(rootSelector, (root) =>
    getValidationSubSet("Config", root.validationResults)
);

export const userIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.user, root.userOriginal)
);

export const userIsNew: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !(root.user && root.user.id)
);
