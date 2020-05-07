import { createSelector } from "reselect";

import { RootState } from "@/state";

import { MergeState } from "../types";

const rootSelector = (state: RootState): MergeState => state.client.policies.merge;

export const policyMergeSelector: (state: RootState) => MergeState = createSelector(
    rootSelector,
    (root) => root
);
