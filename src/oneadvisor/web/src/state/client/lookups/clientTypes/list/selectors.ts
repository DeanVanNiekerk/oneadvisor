import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ClientTypeListState } from "../";

const rootSelector = (state: RootState): ClientTypeListState =>
    state.client.lookups.clientTypes.list;

export const clientTypesSelector: (state: RootState) => ClientTypeListState = createSelector(
    rootSelector,
    (root) => root
);
