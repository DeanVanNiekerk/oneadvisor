import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.client.policies.list;

export const policiesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);

export const policiesCanMergeSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => {
        const policies = root.selectedPolicies;

        if (policies.length < 2) return false;

        //Can only merge policies of the same company
        const companyId = policies[0].companyId;
        return policies.every((p) => p.companyId === companyId);
    }
);

export const policiesSelectedIdsSelector: (
    state: RootState
) => string[] = createSelector(rootSelector, (root) => root.selectedPolicies.map((p) => p.id));
