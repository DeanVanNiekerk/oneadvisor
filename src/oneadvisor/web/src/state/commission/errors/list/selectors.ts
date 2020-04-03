import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.commission.errors.list;

export const commissionErrorsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
