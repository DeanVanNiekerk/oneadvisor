import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { AdviceScopeState } from "../";

const rootSelector = (state: RootState): AdviceScopeState =>
    state.directory.lookups.adviceScopes.adviceScope;

export const adviceScopeSelector: (state: RootState) => AdviceScopeState = createSelector(
    rootSelector,
    (root) => root
);

export const adviceScopeIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.adviceScope, root.adviceScopeOriginal)
);
