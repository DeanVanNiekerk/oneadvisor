import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.useCases.list;

export const useCasesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
