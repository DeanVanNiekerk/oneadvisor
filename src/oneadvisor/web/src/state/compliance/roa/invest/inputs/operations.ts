import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { arrayEqual } from "@/app/utils";
import { RootState } from "@/state/types";

import {
    receiveDiscussedCompanyIds,
    receiveDiscussedFunds,
    receiveDiscussedProductTypeIds,
    receiveInvestment,
    receiveRecommendedCompanyIds,
    receiveRecommendedFunds,
    receiveRecommendedProductTypeIds,
    roaInvestInputsSelector,
} from "./";
import { Investment } from "./types";

export const updateDiscussedProductTypeIds = (
    discussedProductTypeIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        const inputs = roaInvestInputsSelector(getState());

        //Recommended Products must have been discussed
        const recommendedProductTypeIds = inputs.recommendedProductTypeIds.filter((id) =>
            discussedProductTypeIds.some((i) => id === i)
        );

        if (!arrayEqual(recommendedProductTypeIds, inputs.recommendedProductTypeIds))
            dispatch(receiveRecommendedProductTypeIds(recommendedProductTypeIds));

        dispatch(receiveDiscussedProductTypeIds(discussedProductTypeIds));

        //Investment Products must have been discussed
        inputs.investments.forEach((investment) => {
            if (!investment.productTypeId) return;

            if (!discussedProductTypeIds.some((id) => id === investment.productTypeId)) {
                const updated: Investment = {
                    ...investment,
                    productTypeId: "",
                };
                dispatch(receiveInvestment(updated));
            }
        });
    };
};

export const updateDiscussedCompanyIds = (
    discussedCompanyIds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        const inputs = roaInvestInputsSelector(getState());

        //Recommended Companies must have been discussed
        const recommendedCompanyIds = inputs.recommendedCompanyIds.filter((id) =>
            discussedCompanyIds.some((i) => id === i)
        );

        if (!arrayEqual(recommendedCompanyIds, inputs.recommendedCompanyIds))
            dispatch(receiveRecommendedCompanyIds(recommendedCompanyIds));

        dispatch(receiveDiscussedCompanyIds(discussedCompanyIds));

        //Investment Companies must have been discussed
        inputs.investments.forEach((investment) => {
            if (!investment.companyId) return;

            if (!discussedCompanyIds.some((id) => id === investment.companyId)) {
                const updated: Investment = {
                    ...investment,
                    companyId: "",
                };
                dispatch(receiveInvestment(updated));
            }
        });
    };
};

export const updateDiscussedFunds = (
    discussedFunds: string[]
): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        const inputs = roaInvestInputsSelector(getState());

        //Recommended Funds must have been discussed
        const recommendedFunds = inputs.recommendedFunds.filter((id) =>
            discussedFunds.some((i) => id === i)
        );

        if (!arrayEqual(recommendedFunds, inputs.recommendedFunds))
            dispatch(receiveRecommendedFunds(recommendedFunds));

        dispatch(receiveDiscussedFunds(discussedFunds));

        //Investment Funds must have been discussed
        inputs.investments.forEach((investment) => {
            const investmentsFunds = investment.funds.filter((id) =>
                discussedFunds.some((i) => id === i)
            );

            if (!arrayEqual(investmentsFunds, investment.funds)) {
                const updated: Investment = {
                    ...investment,
                    funds: investmentsFunds,
                };
                dispatch(receiveInvestment(updated));
            }
        });
    };
};
