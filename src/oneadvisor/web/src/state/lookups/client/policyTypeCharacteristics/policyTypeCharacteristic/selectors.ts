import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { PolicyTypeCharacteristicState } from "../types";

const rootSelector = (state: RootState): PolicyTypeCharacteristicState =>
    state.lookups.client.policyTypeCharacteristics.policyTypeCharacteristic;

export const policyTypeCharacteristicSelector: (
    state: RootState
) => PolicyTypeCharacteristicState = createSelector(rootSelector, (root) => root);

export const policyTypeCharacteristicIsModifiedSelector: (
    state: RootState
) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.policyTypeCharacteristic, root.policyTypeCharacteristicOriginal)
);
