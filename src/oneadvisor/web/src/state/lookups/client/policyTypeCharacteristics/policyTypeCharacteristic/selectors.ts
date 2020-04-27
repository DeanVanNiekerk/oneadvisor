import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PolicyTypeCharacteristicState } from "../types";

const rootSelector = (state: RootState): PolicyTypeCharacteristicState =>
    state.lookups.client.policyTypeCharacteristics.policyTypeCharacteristic;

export const policyTypeCharacteristicSelector: (
    state: RootState
) => PolicyTypeCharacteristicState = createSelector(rootSelector, (root) => root);
