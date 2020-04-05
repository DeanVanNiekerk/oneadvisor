import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.lookups.adviceScopes.list;

export const adviceScopesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
