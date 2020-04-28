import { createSelector } from "reselect";

import { RootState } from "@/state";

import { POLICY_TYPE_ID_INVESTMENT } from "../../policyTypes/constants";
import { PolicyProductType, PolicyProductTypeListState } from "../types";

const rootSelector = (state: RootState): PolicyProductTypeListState =>
    state.lookups.client.policyProductTypes.list;

export const policyProductTypesSelector: (
    state: RootState
) => PolicyProductTypeListState = createSelector(rootSelector, (root) => root);

export const policyProductTypesInvestmentSelector: (
    state: RootState
) => PolicyProductType[] = createSelector(rootSelector, (root) =>
    root.items.filter((t) => t.policyTypeId === POLICY_TYPE_ID_INVESTMENT)
);
