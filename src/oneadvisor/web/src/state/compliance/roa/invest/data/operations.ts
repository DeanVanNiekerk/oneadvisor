import { AnyAction, Dispatch as DispatchRedux } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { getClient, policyProductTypesSelector } from "@/state/lookups/client";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { RootState } from "@/state/types";

import { receiveData, receiveFetching, roaInvestInputsSelector } from "../";
import { RoaInvestDataAction } from "./";
import { RoaInvestData } from "./types";

type Dispatch = ThunkDispatch<RootState, {}, AnyAction>;

export const loadRoaInvestData = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(receiveFetching(true));

        const inputs = roaInvestInputsSelector(getState());

        const clientFullName = await getClientFullName(dispatch, inputs.clientId);
        const companyNames = getCompanyNames(getState(), inputs.companyIds);
        const productTypeNames = getProductTypeNames(getState(), inputs.productTypeIds);

        const data: RoaInvestData = {
            clientFullName: clientFullName,
            consultReason: inputs.consultReason,
            companyNames: companyNames,
            productTypeNames: productTypeNames,
            funds: inputs.funds,
            advisorRecommendation: inputs.advisorRecommendation,
            investmentLumpsum: inputs.investmentLumpsum,
            investmentRecurringPremium: inputs.investmentRecurringPremium,
            retirementPolicyRecurringPremium: inputs.retirementPolicyRecurringPremium,
        };

        dispatch(receiveData(data));

        dispatch(receiveFetching(false));
    };
};

const getClientFullName = (dispatch: Dispatch, clientId: string | null): Promise<string> => {
    let clientFullName = "";

    if (!clientId) return Promise.resolve(clientFullName);

    return new Promise<string>((resolve) => {
        dispatch(
            getClient(
                clientId,
                //Success
                (client) => {
                    clientFullName = `${client.firstName ? client.firstName : ""} ${
                        client.lastName
                    }`;
                },
                //Always
                () => {
                    resolve(clientFullName);
                }
            )
        );
    });
};

const getCompanyNames = (state: RootState, companyIds: string[]): string[] => {
    const companies = organisationCompaniesSelector(state);
    return companies.filter((c) => companyIds.indexOf(c.id) != -1).map((c) => c.name);
};

const getProductTypeNames = (state: RootState, productTypeIds: string[]): string[] => {
    const productTypes = policyProductTypesSelector(state).items;
    return productTypes.filter((c) => productTypeIds.indexOf(c.id) != -1).map((c) => c.name);
};
