import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.splitRulePolicies.splitRulePolicy;

export const splitRulePolicySelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
