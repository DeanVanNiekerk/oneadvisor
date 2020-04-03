import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.client.policies.list;

export const policiesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
