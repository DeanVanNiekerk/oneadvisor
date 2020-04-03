import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.commission.statements.list;

export const statementsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
