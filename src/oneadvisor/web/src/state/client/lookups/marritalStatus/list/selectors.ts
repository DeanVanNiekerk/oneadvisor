import { createSelector } from "reselect";

import { RootState } from "@/state";

import { MarritalStatusListState } from "../";

const rootSelector = (state: RootState): MarritalStatusListState =>
    state.client.lookups.marritalStatus.list;

export const marritalStatusSelector: (state: RootState) => MarritalStatusListState = createSelector(
    rootSelector,
    (root) => root
);
