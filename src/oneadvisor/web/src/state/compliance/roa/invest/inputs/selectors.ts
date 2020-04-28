import { createSelector } from "reselect";

import { RootState } from "@/state";
import { POLICY_TYPE_ID_INVESTMENT, policyProductTypesSelector } from "@/state/lookups/client";
import { PolicyProductType } from "@/state/lookups/client/policyProductTypes/types";
import {
    Company,
    organisationCompaniesSelector,
    organisationFundsSelector,
} from "@/state/lookups/directory";

import {
    RoaInvestInputDiscussedState,
    RoaInvestInputNeedsState,
    RoaInvestInputRecommendedState,
    RoaInvestInputState,
} from "./types";

const rootSelector = (state: RootState): RoaInvestInputState => state.compliance.roa.invest.inputs;

export const roaInvestInputsSelector: (state: RootState) => RoaInvestInputState = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);

export const roaInvestInputsNeedsSelector: (
    state: RootState
) => RoaInvestInputNeedsState = createSelector(rootSelector, (root) => {
    return {
        clientId: root.clientId,
        consultReason: root.consultReason,
        investmentAdviceType: root.investmentAdviceType,
        needMonthly: root.needMonthly,
        needLumpsum: root.needLumpsum,
        contributionMonthly: root.contributionMonthly,
        contributionLumpsum: root.contributionLumpsum,
    };
});

export const roaInvestInputsDiscussedSelector: (
    state: RootState
) => RoaInvestInputDiscussedState = createSelector(rootSelector, (root) => {
    return {
        discussedProductTypeIds: root.discussedProductTypeIds,
        discussedCompanyIds: root.discussedCompanyIds,
        discussedFunds: root.discussedFunds,
    };
});

export const roaInvestInputsRecommendedSelector: (
    state: RootState
) => RoaInvestInputRecommendedState = createSelector(rootSelector, (root) => {
    return {
        recommendedProductTypeIds: root.recommendedProductTypeIds,
        recommendedCompanyIds: root.recommendedCompanyIds,
        recommendedFunds: root.recommendedFunds,
        recommendedAction: root.recommendedAction,
    };
});

export const roaInvestInputsClientChoiceSelector: (state: RootState) => string = createSelector(
    rootSelector,
    (root) => {
        return root.clientChoice;
    }
);

export const roaInvestDiscussedProductTypeIdsSelector: (
    state: RootState
) => string[] = createSelector(rootSelector, (root) => {
    return root.discussedProductTypeIds;
});

export const roaInvestRecommendedProductTypesSelector: (
    state: RootState
) => PolicyProductType[] = createSelector(
    roaInvestDiscussedProductTypeIdsSelector,
    policyProductTypesSelector,
    (discussedProductTypeIds, policyProductTypes) => {
        return policyProductTypes.items.filter(
            (type) =>
                type.policyTypeId === POLICY_TYPE_ID_INVESTMENT &&
                discussedProductTypeIds.some((id) => id === type.id)
        );
    }
);

export const roaInvestDiscussedCompanyIdsSelector: (state: RootState) => string[] = createSelector(
    rootSelector,
    (root) => {
        return root.discussedCompanyIds;
    }
);

export const roaInvestRecommendedCompaniesSelector: (
    state: RootState
) => Company[] = createSelector(
    roaInvestDiscussedCompanyIdsSelector,
    organisationCompaniesSelector,
    (discussedCompanyIds, companies) => {
        return companies.filter((company) => discussedCompanyIds.some((id) => id === company.id));
    }
);

export const roaInvestDiscussedFundsSelector: (state: RootState) => string[] = createSelector(
    rootSelector,
    (root) => {
        return root.discussedFunds;
    }
);

export const roaInvestRecommendedFundsSelector: (state: RootState) => string[] = createSelector(
    roaInvestDiscussedFundsSelector,
    organisationFundsSelector,
    (discussedFunds, funds) => {
        return funds.filter((fund) => discussedFunds.some((f) => f === fund));
    }
);
