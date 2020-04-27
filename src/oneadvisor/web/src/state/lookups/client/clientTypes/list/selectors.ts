import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ClientTypeListState } from "../types";

const rootSelector = (state: RootState): ClientTypeListState =>
    state.lookups.client.clientTypes.list;

export const clientTypesSelector: (state: RootState) => ClientTypeListState = createSelector(
    rootSelector,
    (root) => root
);
