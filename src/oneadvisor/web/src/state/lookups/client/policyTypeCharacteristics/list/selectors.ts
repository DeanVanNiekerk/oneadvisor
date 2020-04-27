import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyTypeCharacteristicListState } from "../types";

const rootSelector = (state: RootState): PolicyTypeCharacteristicListState =>
    state.lookups.client.policyTypeCharacteristics.list;

export const policyTypeCharacteristicsSelector: (
    state: RootState
) => PolicyTypeCharacteristicListState = createSelector(rootSelector, (root) => root);
