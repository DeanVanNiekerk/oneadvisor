import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AdviceScopeListState } from "../";

const rootSelector = (state: RootState): AdviceScopeListState =>
    state.lookups.directory.adviceScopes.list;

export const adviceScopesSelector: (state: RootState) => AdviceScopeListState = createSelector(
    rootSelector,
    (root) => root
);
