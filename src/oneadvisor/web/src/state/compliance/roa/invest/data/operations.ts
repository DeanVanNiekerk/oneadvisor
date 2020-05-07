import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { formatCurrency } from "@/app/utils";
import { userFullNameSelector } from "@/state/auth/token/selectors";
import {
    getClient,
    policyProductTypesSelector,
    policyTypeCharacteristicsSelector,
} from "@/state/lookups/client";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { RootState } from "@/state/types";

import {
    receiveData,
    receiveFetching,
    roaInvestInputsSelector,
    roaInvestLookupsSelector,
} from "../";
import { Investment } from "../inputs/types";
import { InvestmentData, ProductTypeCharacteristics, RoaInvestData } from "./types";

type Dispatch = ThunkDispatch<RootState, {}, AnyAction>;

export const loadRoaInvestData = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(receiveFetching(true));

        const rootState = getState();

        const inputs = roaInvestInputsSelector(rootState);

        const { fullName, idNumber } = await getClientFullName(dispatch, inputs.clientId);
        const userFullName = userFullNameSelector(rootState);

        const discussedCompanyNames = getCompanyNames(rootState, inputs.discussedCompanyIds);
        const discussedProductTypeNames = getProductTypeNames(
            rootState,
            inputs.discussedProductTypeIds
        );

        const recommendedCompanyNames = getCompanyNames(rootState, inputs.recommendedCompanyIds);
        const recommendedProductTypeNames = getProductTypeNames(
            rootState,
            inputs.recommendedProductTypeIds
        );

        const currencyDecimal = 0;

        const data: RoaInvestData = {
            clientFullName: fullName,
            clientIdNumber: idNumber,
            userFullName: userFullName,
            consultReason: inputs.consultReason,
            investmentAdviceType: getInvestmentAdviceTypeName(
                rootState,
                inputs.investmentAdviceTypeCode
            ),
            needMonthly: formatCurrency(inputs.needMonthly, currencyDecimal),
            needLumpsum: formatCurrency(inputs.needLumpsum, currencyDecimal),
            contributionMonthly: formatCurrency(inputs.contributionMonthly, currencyDecimal),
            contributionLumpsum: formatCurrency(inputs.contributionLumpsum, currencyDecimal),

            discussedProductTypes: discussedProductTypeNames,
            discussedCompanies: discussedCompanyNames,
            discussedFunds: inputs.discussedFundCodes,

            recommendedProductTypes: recommendedProductTypeNames,
            recommendedCompanies: recommendedCompanyNames,
            recommendedFunds: inputs.recommendedFundCodes,
            recommendedAction: inputs.recommendedAction,

            clientChoice: inputs.clientChoice,

            investments: inputs.investments.map((investment, index) =>
                getInvestmentData(rootState, index, investment, currencyDecimal)
            ),
        };

        dispatch(receiveData(data));

        dispatch(receiveFetching(false));
    };
};

type ClientDetails = {
    fullName: string;
    idNumber: string;
};
const getClientFullName = (dispatch: Dispatch, clientId: string | null): Promise<ClientDetails> => {
    let fullName = "";
    let idNumber = "";

    if (!clientId) return Promise.resolve({ fullName, idNumber });

    return new Promise<ClientDetails>((resolve) => {
        dispatch(
            getClient(
                clientId,
                //Success
                (client) => {
                    fullName = `${client.firstName ? client.firstName : ""} ${client.lastName}`;
                    idNumber = client.idNumber;
                },
                //Always
                () => {
                    resolve({ fullName, idNumber });
                }
            )
        );
    });
};

const getInvestmentAdviceTypeName = (
    state: RootState,
    investmentAdviceTypeCode: string
): string => {
    const lookups = roaInvestLookupsSelector(state);
    const type = lookups.investmentAdviceTypes.find((t) => t.code === investmentAdviceTypeCode);
    if (!type) return "";
    return type.name;
};

const getCompanyNames = (state: RootState, companyIds: string[]): string[] => {
    const companies = organisationCompaniesSelector(state);
    return companies.filter((c) => companyIds.indexOf(c.id) != -1).map((c) => c.name);
};

const getProductTypeNames = (state: RootState, productTypeIds: string[]): string[] => {
    const productTypes = policyProductTypesSelector(state).items;
    return productTypes.filter((c) => productTypeIds.indexOf(c.id) != -1).map((c) => c.name);
};

const getInvestmentData = (
    state: RootState,
    index: number,
    investment: Investment,
    currencyDecimal: number
): InvestmentData => {
    let companyName = "";
    const companyNames = getCompanyNames(state, [investment.companyId]);
    if (companyNames.length > 0) companyName = companyNames[0];

    let productTypeName = "";
    const productTypeNames = getProductTypeNames(state, [investment.productTypeId]);
    if (productTypeNames.length > 0) productTypeName = productTypeNames[0];

    let upfrontFee = "Refer to quotation";
    if (investment.upfrontFeePercent != null && investment.upfrontFeePercent != undefined)
        upfrontFee = formatPercent(investment.upfrontFeePercent);
    else if (investment.upfrontFeeAmount != null && investment.upfrontFeeAmount != undefined)
        upfrontFee = formatCurrency(investment.upfrontFeeAmount, currencyDecimal);

    const data: InvestmentData = {
        number: (index + 1).toString(),
        companyName: companyName,
        productTypeName: productTypeName,
        funds: investment.fundCodes,
        contributionLumpsum: formatCurrency(investment.contributionLumpsum, currencyDecimal),
        contributionPremium: formatCurrency(investment.contributionPremium, currencyDecimal),
        upfrontFee: upfrontFee,
        assetManagementFee: formatPercent(
            investment.assetManagementFeePercent,
            "Refer to quotation"
        ),
        productCharacteristics: getProductCharacteristics(state, investment.productTypeId),
    };

    return data;
};

const getProductCharacteristics = (
    state: RootState,
    productTypeId: string
): ProductTypeCharacteristics[] => {
    const productTypes = policyProductTypesSelector(state).items;
    const characteristics = policyTypeCharacteristicsSelector(state).items;

    const productType = productTypes.find((p) => p.id === productTypeId);

    if (!productType) return [];

    return productType.policyTypeCharacteristics.map((c) => {
        let name = "";

        const characteristic = characteristics.find((ch) => ch.id === c.policyTypeCharacteristicId);

        if (!!characteristic) name = characteristic.name;

        return {
            name: name,
            description: c.description,
        };
    });
};

const formatPercent = (value: number | null, fallback = ""): string => {
    if (value === null || value === undefined) return fallback;

    return `${value.toString()}%`;
};
