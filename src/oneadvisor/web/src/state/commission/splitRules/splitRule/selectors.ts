import { createSelector } from "reselect";

import { RootState } from "@/state";

import { SplitRuleState } from "../";

const rootSelector = (state: RootState): SplitRuleState => state.commission.splitRules.splitRule;

export const splitRuleSelector: (state: RootState) => SplitRuleState = createSelector(
    rootSelector,
    (root) => root
);
