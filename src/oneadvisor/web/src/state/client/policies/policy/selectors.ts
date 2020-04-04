import { CascaderOptionType } from "antd/lib/cascader";
import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { PolicyState } from "../";
import {
    policyProductCascade,
    policyProductsSelector,
    policyProductTypesSelector,
    policyTypesSelector,
} from "../../lookups";

const rootSelector = (state: RootState): PolicyState => state.client.policies.policy;

export const policySelector: (state: RootState) => PolicyState = createSelector(
    rootSelector,
    (root) => root
);

export const policyIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.policy, root.policyOriginal)
);

export const policyIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);

export const policyProductCascaseSelector: (
    state: RootState
) => CascaderOptionType[] = createSelector(
    rootSelector,
    policyTypesSelector,
    policyProductTypesSelector,
    policyProductsSelector,
    (root, policyTypes, policyProductTypes, policyProducts) => {
        return policyProductCascade(
            policyTypes.items,
            policyProductTypes.items,
            policyProducts.items,
            root.policy && root.policy.companyId ? root.policy.companyId : ""
        );
    }
);

export const policyProductCascaseValuesSelector: (state: RootState) => string[] = createSelector(
    rootSelector,
    (root) => {
        const values: string[] = [];
        const policy = root.policy;

        if (!policy) return values;

        if (policy.policyTypeId) {
            values.push(policy.policyTypeId);

            if (policy.policyProductTypeId) {
                values.push(policy.policyProductTypeId);

                if (policy.policyProductId) {
                    values.push(policy.policyProductId);
                }
            }
        }

        return values;
    }
);
