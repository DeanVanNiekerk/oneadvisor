import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { SplitRulePolicyState } from "../";

const rootSelector = (state: RootState): SplitRulePolicyState =>
    state.commission.splitRulePolicies.splitRulePolicy;

export const splitRulePolicySelector: (state: RootState) => SplitRulePolicyState = createSelector(
    rootSelector,
    (root) => root
);
