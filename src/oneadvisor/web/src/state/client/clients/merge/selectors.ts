import { createSelector } from "reselect";

import { RootState } from "@/state";

import { MergeState } from "../";

const rootSelector = (state: RootState): MergeState => state.client.clients.merge;

export const clientMergeSelector: (state: RootState) => MergeState = createSelector(
    rootSelector,
    (root) => root
);

export const clientsMergingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !!(root.clients.length > 0) || root.fetching
);
