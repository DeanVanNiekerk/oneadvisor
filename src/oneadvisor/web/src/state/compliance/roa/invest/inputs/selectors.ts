import { createSelector } from "reselect";

import { RootState } from "@/state";
import { POLICY_TYPE_ID_INVESTMENT, policyProductTypesSelector } from "@/state/lookups/client";
import { PolicyProductType } from "@/state/lookups/client/policyProductTypes/types";
import {
    Company,
    organisationCompaniesSelector,
    organisationFundsSelector,
} from "@/state/lookups/directory";

import { RoaInvestInputState } from "./types";

const rootSelector = (state: RootState): RoaInvestInputState => state.compliance.roa.invest.inputs;

export const roaInvestInputsSelector: (state: RootState) => RoaInvestInputState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);

export const roaInvestRecommendedProductTypesSelector: (
    state: RootState
) => PolicyProductType[] = createSelector(
    rootSelector,
    policyProductTypesSelector,
    (root, policyProductTypes) => {
        return policyProductTypes.items.filter(
            (type) =>
                type.policyTypeId === POLICY_TYPE_ID_INVESTMENT &&
                root.discussedProductTypeIds.some((id) => id === type.id)
        );
    }
);

export const roaInvestRecommendedCompaniesSelector: (
    state: RootState
) => Company[] = createSelector(rootSelector, organisationCompaniesSelector, (root, companies) => {
    return companies.filter((company) => root.discussedCompanyIds.some((id) => id === company.id));
});

export const roaInvestRecommendedFundsSelector: (state: RootState) => string[] = createSelector(
    rootSelector,
    organisationFundsSelector,
    (root, funds) => {
        return funds.filter((fund) => root.discussedFunds.some((f) => f === fund));
    }
);
