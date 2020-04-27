import { createSelector } from "reselect";

import { RootState } from "@/state";

import { policyTypeCharacteristicsSelector } from "../../policyTypeCharacteristics/list/selectors";
import { PolicyProductTypeState, PolicyTypeCharacteristicDescription } from "../types";

const rootSelector = (state: RootState): PolicyProductTypeState =>
    state.lookups.client.policyProductTypes.policyProductType;

export const policyProductTypeSelector: (
    state: RootState
) => PolicyProductTypeState = createSelector(rootSelector, (root) => root);

export const policyProductTypeCharacteristicDescriptionsSelector: (
    state: RootState
) => PolicyTypeCharacteristicDescription[] = createSelector(
    rootSelector,
    policyTypeCharacteristicsSelector,
    (root, policyTypeCharacteristics) => {
        if (!root.policyProductType) return [];

        const policyProductType = root.policyProductType;
        const characteristics = policyTypeCharacteristics.items.filter(
            (p) => p.policyTypeId === policyProductType.policyTypeId
        );

        return characteristics.map((characteristic) => {
            let description = policyProductType.policyTypeCharacteristics.find(
                (c) => characteristic.id === c.policyTypeCharacteristicId
            );

            if (!description) {
                description = {
                    policyTypeCharacteristicId: characteristic.id,
                    description: "",
                };
            }

            return description;
        });
    }
);
