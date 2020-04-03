import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.commission.templates.list;

export const commissionStatementTemplatesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
