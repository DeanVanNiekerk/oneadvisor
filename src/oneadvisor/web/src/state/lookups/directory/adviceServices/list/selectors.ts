import { createSelector } from "reselect";

import { RootState } from "@/state";

import { AdviceServiceListState } from "../";

const rootSelector = (state: RootState): AdviceServiceListState =>
    state.lookups.directory.adviceServices.list;

export const adviceServicesSelector: (state: RootState) => AdviceServiceListState = createSelector(
    rootSelector,
    (root) => root
);
