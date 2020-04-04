import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.commission.splitRules.list;

export const splitRulesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
